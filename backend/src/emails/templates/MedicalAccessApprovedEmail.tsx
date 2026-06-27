import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Preview,
  Heading,
  Hr,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface MedicalAccessApprovedEmailProps {
  fullName: string;
  email: string;
  position: string;
  medicalCenter: string;
}

export default function MedicalAccessApprovedEmail({
  fullName,
  email,
  position,
  medicalCenter,
}: MedicalAccessApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido al equipo de S.I.R.E!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 ¡Bienvenido a S.I.R.E!</Heading>

          <Text style={text}>Hola, {fullName}:</Text>

          <Text style={text}>
            ¡Excelentes noticias! Tu solicitud de acceso como personal médico ha sido{' '}
            <strong>aprobada exitosamente</strong>.
          </Text>

          <Text style={text}>
            Ahora formas parte del Sistema de Información y Registro de Emergencias, una herramienta
            vital para salvar vidas en momentos críticos.
          </Text>

          <Hr style={hr} />

          <Text style={infoText}>
            <strong>Usuario:</strong> {email}
          </Text>
          <Text style={infoText}>
            <strong>Cargo:</strong> {position}
          </Text>
          <Text style={infoText}>
            <strong>Centro Médico:</strong> {medicalCenter}
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Puedes iniciar sesión ahora mismo con el correo registrado y la contraseña que te fue
            asignada.
          </Text>

          <Button href={`${process.env.URL_FRONTEND}/login`} style={button}>
            Iniciar Sesión
          </Button>

          <Text style={text}>
            Por razones de seguridad, te recomendamos cambiar tu contraseña después del primer
            inicio de sesión.
          </Text>

          <Text style={footer}>
            Gracias por ser parte del cambio.
            <br />
            Equipo S.I.R.E
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #e6ebf1',
  borderRadius: '5px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0 48px',
  margin: '30px 0',
  textAlign: 'center' as const,
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
  margin: '16px 0',
};

const infoText = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
  margin: '8px 0',
};

const button = {
  backgroundColor: '#656ee8',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  margin: '24px auto',
  padding: '12px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 48px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
  marginTop: '32px',
  textAlign: 'center' as const,
};
