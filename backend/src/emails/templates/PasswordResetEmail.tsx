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
  Button,
  Link,
} from '@react-email/components';

import * as React from 'react';

interface PasswordResetEmailProps {
  name: string;
  resetToken: string;
  userId: number;
}

export default function PasswordResetEmail({ name, resetToken, userId }: PasswordResetEmailProps) {
  const resetUrl = `${process.env.URL_FRONTEND}/reset-password?userId=${userId}&token=${resetToken}`;
  return (
    <Html>
      <Head />
      <Preview>Recuperación de contraseña - S.I.R.E</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🔐 Recuperación de Contraseña</Heading>

          <Text style={text}>Hola, {name}:</Text>

          <Text style={text}>
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en S.I.R.E.
          </Text>

          <Text style={text}>
            Si no solicitaste este cambio, puedes ignorar este mensaje de manera segura.
          </Text>

          <Hr style={hr} />

          <Section style={buttonSection}>
            <Button href={resetUrl} style={button}>
              Restablecer mi Contraseña
            </Button>
          </Section>

          <Text style={text}>
            Si el botón no funciona, copia y pega este enlace en tu navegador:
          </Text>
          <Text style={linkText}>
            <Link href={resetUrl} style={linkAnchor}>
              {resetUrl}
            </Link>
          </Text>

          <Hr style={hr} />

          <Section style={tokenSection}>
            <Text style={tokenLabel}>O ingresa tu código de recuperación manualmente:</Text>
            <Text style={tokenText}>{resetToken}</Text>
            <Text style={tokenSubtext}>ID de Usuario: {userId}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>Este enlace y código expirarán en 1 hora por seguridad.</Text>

          <Text style={footer}>
            Sistema de Información y Registro de Emergencias (S.I.R.E)
            <br />
            Este es un mensaje automático. Por favor no respondas a este correo.
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

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 48px',
};

const tokenSection = {
  backgroundColor: '#f8f9fa',
  padding: '24px',
  margin: '0 48px',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const tokenLabel = {
  color: '#525f7f',
  fontSize: '14px',
  margin: '0 0 12px 0',
};

const tokenText = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  letterSpacing: '4px',
  margin: '12px 0',
};

const tokenSubtext = {
  color: '#8898aa',
  fontSize: '12px',
  margin: '12px 0 0 0',
};

const buttonSection = {
  textAlign: 'center' as const,
  padding: '0 48px',
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
  width: '260px',
  margin: '8px auto',
  padding: '12px',
};

const linkText = {
  color: '#525f7f',
  fontSize: '12px',
  lineHeight: '18px',
  padding: '0 48px',
  margin: '4px 0',
  wordBreak: 'break-all' as const,
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
