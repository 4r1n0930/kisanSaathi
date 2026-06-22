export class FarmerService {
  static buildRegistrationPayload(payload: any) {
    const { name, email, phone, password, kisanId, documents, village, location } = payload;

    if (!name || !email || !phone || !password || !kisanId || !village) {
      throw { statusCode: 400, message: 'Missing required farmer registration fields' };
    }

    if (!documents || (Array.isArray(documents) && documents.length === 0)) {
      throw { statusCode: 400, message: 'Farmer registration requires at least one document URL' };
    }

    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      throw { statusCode: 400, message: 'Farmer registration requires location.latitude and location.longitude' };
    }

    return {
      role: 'FARMER',
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      password: String(password),
      kisanId: String(kisanId).trim(),
      documents: Array.isArray(documents) ? documents : [String(documents)],
      village: String(village).trim(),
      location: {
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
      },
    };
  }
}
