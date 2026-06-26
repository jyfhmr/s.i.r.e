import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Preview,
  Heading,
  Button,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface GenericTestEmailProps {
  recipientName?: string;
}

export default function GenericTestEmail({
  recipientName = 'Usuario de Prueba',
}: GenericTestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Este es un correo de prueba de tu aplicación</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Hola, mundo!</Heading>

          <Text style={text}>
            Saludos, <strong>{recipientName}</strong>.
          </Text>

          <Text style={text}>
            Si estás leyendo esto, significa que el sistema de envío de correos está configurado
            correctamente y funcionando a la perfección. Este es solo un texto de relleno para
            comprobar que el diseño, los colores y los componentes se renderizan como se espera.
          </Text>

          <Hr style={hr} />

          <Text style={text}>A continuación, un botón de prueba que no hace nada importante:</Text>

          <Button href="https://example.com" style={button}>
            Botón de Prueba
          </Button>

          <Text style={footer}>
            Este es un correo autogenerado. Por favor, no respondas a esta dirección.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos de prueba (Hardcoded, sin dependencias externas)
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
  textAlign: 'center' as const,
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
  textAlign: 'left' as const,
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
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
  marginTop: '32px',
  textAlign: 'center' as const,
};
