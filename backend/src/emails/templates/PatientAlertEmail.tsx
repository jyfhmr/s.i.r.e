import { Html, Head, Body, Container, Text, Preview, Heading, Hr } from '@react-email/components';
import * as React from 'react';

interface PatientAlertEmailProps {
  recipientName: string;
  patientName: string;
  alias?: string;
  status: string;
  location: string;
  dni: string;
}

export default function PatientAlertEmail({
  recipientName,
  patientName,
  alias,
  status,
  location,
  dni,
}: PatientAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Información sobre {alias || patientName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📢 Alerta de S.I.R.E</Heading>

          <Text style={text}>Hola, {recipientName}:</Text>

          <Text style={text}>
            Hemos registrado información sobre{' '}
            <strong>{alias ? `${alias} (${patientName})` : patientName}</strong> (C.I: {dni}) en
            nuestro sistema.
          </Text>

          <Hr style={hr} />

          <Text style={infoText}>
            <strong>Estado:</strong> {status}
          </Text>
          <Text style={infoText}>
            <strong>Ubicación:</strong> {location}
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Para más información, puedes comunicarte directamente con el centro de salud indicado.
          </Text>

          <Text style={footer}>
            Este es un mensaje automático del Sistema de Información y Registro de Emergencias
            (S.I.R.E). Por favor no respondas a este correo.
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
