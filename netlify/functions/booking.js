const GHL_BASE_URL = 'https://services.leadconnectorhq.com';
const GHL_CONTACT_VERSION = '2021-04-15';
const GHL_NOTE_VERSION = '2021-07-28';
const GHL_MEDIA_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'jGKx4eTTbP1enXZEBWxm';
const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'square_footage'];

const serviceLabels = {
  restaurant: 'Restaurant Cleaning',
  office: 'Office Cleaning',
  fitness: 'Fitness Center Cleaning',
  school: 'School / Daycare Cleaning',
  medical: 'Medical Facility Cleaning',
  move: 'Move-In / Move-Out Cleaning',
  other: 'Other',
};

const frequencyLabels = {
  'one-time': 'One Time Clean',
  'multiple-times-week': 'Multiple Times a Week',
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  monthly: 'Monthly',
  other: 'Other',
};

const parseJson = (text) => {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
};

const parseContentDisposition = (value = '') => {
  const name = value.match(/name="([^"]+)"/)?.[1];
  const filename = value.match(/filename="([^"]*)"/)?.[1];

  return { name, filename };
};

const parseMultipartForm = (event) => {
  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[1] || contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/)?.[2];

  if (!boundary) {
    throw new Error('Missing form boundary.');
  }

  const body = Buffer.from(event.body || '', event.isBase64Encoded ? 'base64' : 'utf8');
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const fields = {};
  const files = [];

  let position = 0;

  while (position < body.length) {
    const boundaryStart = body.indexOf(boundaryBuffer, position);
    if (boundaryStart === -1) break;

    const partStart = boundaryStart + boundaryBuffer.length;

    if (body.slice(partStart, partStart + 2).toString() === '--') break;

    const headersStart = body.slice(partStart, partStart + 2).toString() === '\r\n'
      ? partStart + 2
      : partStart;
    const headersEnd = body.indexOf(Buffer.from('\r\n\r\n'), headersStart);

    if (headersEnd === -1) break;

    const headersRaw = body.slice(headersStart, headersEnd).toString('utf8');
    const headers = Object.fromEntries(
      headersRaw
        .split('\r\n')
        .map((line) => {
          const index = line.indexOf(':');
          return index === -1
            ? null
            : [line.slice(0, index).trim().toLowerCase(), line.slice(index + 1).trim()];
        })
        .filter(Boolean)
    );

    const nextBoundary = body.indexOf(boundaryBuffer, headersEnd + 4);
    if (nextBoundary === -1) break;

    const contentEnd = body.slice(nextBoundary - 2, nextBoundary).toString() === '\r\n'
      ? nextBoundary - 2
      : nextBoundary;
    const content = body.slice(headersEnd + 4, contentEnd);
    const { name, filename } = parseContentDisposition(headers['content-disposition']);

    if (name && filename) {
      if (filename && content.length) {
        files.push({
          fieldName: name,
          filename,
          type: headers['content-type'] || 'application/octet-stream',
          buffer: content,
          size: content.length,
        });
      }
    } else if (name) {
      fields[name] = content.toString('utf8');
    }

    position = nextBoundary;
  }

  return { fields, files };
};

const ghlJsonRequest = async ({ path, method = 'POST', version, token, body }) => {
  const response = await fetch(`${GHL_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Version: version,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = parseJson(text);

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message || data.error || `GHL request failed with ${response.status}`;

    throw new Error(message);
  }

  return data;
};

const extractMediaUrl = (data) => {
  const candidates = [
    data?.url,
    data?.fileUrl,
    data?.file?.url,
    data?.file?.fileUrl,
    data?.data?.url,
    data?.data?.fileUrl,
    data?.data?.file?.url,
    data?.data?.file?.fileUrl,
  ];

  return candidates.find((value) => typeof value === 'string' && value.startsWith('http')) || '';
};

const uploadPhotoToGhl = async ({ file, token, locationId }) => {
  const formData = new FormData();

  formData.append('file', new Blob([file.buffer], { type: file.type }), file.filename);
  formData.append('hosted', 'false');
  formData.append('altType', 'location');
  formData.append('altId', locationId);

  const response = await fetch(`${GHL_BASE_URL}/medias/upload-file`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      Version: GHL_MEDIA_VERSION,
    },
    body: formData,
  });

  const text = await response.text();
  const data = parseJson(text);

  if (!response.ok) {
    const message = data.message || data.error || `GHL media upload failed with ${response.status}`;
    throw new Error(message);
  }

  return {
    name: file.filename,
    url: extractMediaUrl(data),
  };
};

const buildNote = (payload, uploadedPhotos = []) => {
  const service = serviceLabels[payload.service_type] || clean(payload.service_type) || 'Not specified';
  const frequency = frequencyLabels[payload.cleaning_frequency] || clean(payload.cleaning_frequency) || 'Not specified';
  const otherFrequency = clean(payload.cleaning_frequency_other);
  const photoLines = uploadedPhotos.length
    ? uploadedPhotos.map((photo, index) => `${index + 1}. ${photo.name}${photo.url ? ` - ${photo.url}` : ''}`)
    : ['None'];

  return [
    'New website quote request',
    '',
    `Name: ${clean(payload.first_name)} ${clean(payload.last_name)}`.trim(),
    `Email: ${clean(payload.email)}`,
    `Phone: ${clean(payload.phone)}`,
    `Business: ${clean(payload.business_name) || 'Not provided'}`,
    `Service Type: ${service}`,
    `Approx. Square Footage: ${clean(payload.square_footage)}`,
    `Cleaning Frequency: ${frequency}${otherFrequency ? ` - ${otherFrequency}` : ''}`,
    `Message: ${clean(payload.message) || 'Not provided'}`,
    'Uploaded Photos:',
    ...photoLines,
    '',
    'Source: Astro booking form',
  ].join('\n');
};

const validateFiles = (files) => {
  const photos = files.filter((file) => file.fieldName === 'space_photos');

  if (photos.length > MAX_PHOTOS) {
    return { error: `Please upload no more than ${MAX_PHOTOS} photos.` };
  }

  for (const photo of photos) {
    if (!ALLOWED_IMAGE_TYPES.has(photo.type)) {
      return { error: 'Please upload JPG, PNG, WebP, or GIF images only.' };
    }

    if (photo.size > MAX_PHOTO_SIZE) {
      return { error: 'Each image must be 5 MB or smaller.' };
    }
  }

  return { photos };
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;

  if (!token) {
    return json(500, { error: 'Booking integration is missing GHL_API_TOKEN.' });
  }

  let payload;
  let files = [];

  try {
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';

    if (contentType.includes('multipart/form-data')) {
      const parsed = parseMultipartForm(event);
      payload = parsed.fields;
      files = parsed.files;
    } else {
      payload = JSON.parse(event.body || '{}');
    }
  } catch (error) {
    console.error('Invalid booking submission:', error);
    return json(400, { error: 'Invalid form submission.' });
  }

  const missing = requiredFields.filter((field) => !clean(payload[field]));

  if (missing.length) {
    return json(400, { error: 'Please complete all required fields.' });
  }

  if (payload.cleaning_frequency === 'other' && !clean(payload.cleaning_frequency_other)) {
    return json(400, { error: 'Please enter your cleaning frequency details.' });
  }

  const { photos, error } = validateFiles(files);

  if (error) {
    return json(400, { error });
  }

  try {
    const contact = await ghlJsonRequest({
      path: '/contacts/upsert',
      version: GHL_CONTACT_VERSION,
      token,
      body: {
        locationId,
        firstName: clean(payload.first_name),
        lastName: clean(payload.last_name),
        name: `${clean(payload.first_name)} ${clean(payload.last_name)}`.trim(),
        email: clean(payload.email),
        phone: clean(payload.phone),
        companyName: clean(payload.business_name) || undefined,
        source: 'Flex Commercial Services Website',
        country: 'US',
        tags: ['Website Lead', 'Booking Form'],
        createNewIfDuplicateAllowed: false,
      },
    });

    const contactId = contact?.contact?.id || contact?.id;

    if (!contactId) {
      throw new Error('GHL did not return a contact ID.');
    }

    const uploadedPhotos = [];

    for (const photo of photos) {
      uploadedPhotos.push(await uploadPhotoToGhl({ file: photo, token, locationId }));
    }

    await ghlJsonRequest({
      path: `/contacts/${contactId}/notes`,
      version: GHL_NOTE_VERSION,
      token,
      body: {
        body: buildNote(payload, uploadedPhotos),
      },
    });

    return json(200, { ok: true });
  } catch (error) {
    console.error('GHL booking submission failed:', error);
    return json(502, {
      error: 'We could not send your request. Please call (216)-801-9686 or try again.',
    });
  }
};
