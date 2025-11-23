import request from 'supertest';
import app from '../app.js';

describe('API Tests', () => {
  let donadorToken = '';
  let beneficiarioToken = '';
  let donacionId = null;

  it('Registro de donador', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'donador_test',
        correo: 'donador_test@mail.com',
        password: '123456',
        rol: 'donador',
        nombre: 'Empresa Test',
        tipo_entidad: 'empresa',
        direccion: 'Av. Test',
        ruc: '12345678901',
        persona_contacto: 'Juan Test',
        telefono: '999888777',
        ciudad: 'Lima'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    donadorToken = res.body.token;
  });

  it('Registro de beneficiario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'beneficiario_test',
        correo: 'beneficiario_test@mail.com',
        password: '123456',
        rol: 'beneficiario',
        nombre: 'ONG Test',
        tipo_entidad: 'ong',
        direccion: 'Calle Test',
        capacidad_atencion: 10,
        persona_contacto: 'Maria Test',
        telefono: '988776655',
        ciudad: 'Arequipa'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    beneficiarioToken = res.body.token;
  });

  it('Login donador', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'donador_test@mail.com', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    donadorToken = res.body.token;
  });

  it('Login beneficiario', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'beneficiario_test@mail.com', password: '123456' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    beneficiarioToken = res.body.token;
  });

  it('Crear donación', async () => {
    const res = await request(app)
      .post('/api/donaciones')
      .set('Authorization', `Bearer ${donadorToken}`)
      .send({
        nombre: 'Ropa de abrigo',
        descripcion: '20 frazadas nuevas',
        cantidad: 20,
        fecha_vencimiento: '2025-12-31',
        ubicacion: 'Lima',
        id_categoria: 1
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.id_donacion).toBeDefined();
    donacionId = res.body.id_donacion;
  });

  it('Crear postulación', async () => {
    const res = await request(app)
      .post('/api/postulaciones')
      .set('Authorization', `Bearer ${beneficiarioToken}`)
      .send({ id_donacion: donacionId });
    expect(res.statusCode).toBe(201);
    expect(res.body.id_postulacion).toBeDefined();
  });
});
