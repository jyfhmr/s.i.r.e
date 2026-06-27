import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Preview,
  Heading,
  Hr,
  Section,
  Link,
} from '@react-email/components';

import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export default function ContactEmail({ name, email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nuevo mensaje de contacto - S.I.R.E</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📩 Nuevo mensaje de contacto</Heading>

          <Text style={text}>Has recibido una nueva consulta desde el formulario de contacto.</Text>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Text style={infoText}>
              <strong>Nombre:</strong> {name}
            </Text>
            <Text style={infoText}>
              <strong>Correo:</strong>{' '}
              <Link href={`mailto:${email}`} style={linkAnchor}>
                {email}
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={infoLabel}>Mensaje:</Text>
          <Text style={messageText}>{message}</Text>

          <Hr style={hr} />

          <Text style={footer}>
            Sistema de Información y Registro de Emergencias (S.I.R.E)
            <br />
            Este mensaje fue enviado desde el formulario de contacto del sitio.
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

const infoSection = {
  padding: '0 48px',
};

const infoText = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
};

const infoLabel = {
  color: '#525f7f',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  padding: '0 48px',
  margin: '8px 0 4px 0',
};

const messageText = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '16px',
  margin: '0 48px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  whiteSpace: 'pre-wrap' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 48px',
};

const linkAnchor = {
  color: '#656ee8',
  textDecoration: 'underline',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
  marginTop: '32px',
  textAlign: 'center' as const,
};
