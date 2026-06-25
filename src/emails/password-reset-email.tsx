import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Heading,
  Preview,
  Font,
} from "@react-email/components"

interface Props {
  name: string
  resetUrl: string
}

export function PasswordResetEmail({ name, resetUrl }: Props) {
  const firstName = name.split(" ")[0]

  return (
    <Html lang="pt-BR">
      <Head>
        <Font
          fontFamily="Cinzel"
          fallbackFontFamily="Georgia"
          webFont={{
            url: "https://fonts.gstatic.com/s/cinzel/v23/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnTYrvDE5ZdqU.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>Redefina sua senha do Mythara RPG</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Section style={s.topAccent} />

          <Section style={s.brandSection}>
            <Text style={s.brandName}>MYTHARA</Text>
            <Text style={s.brandSub}>R · P · G</Text>
          </Section>

          <Hr style={s.divider} />

          <Section style={s.content}>
            <Heading style={s.heading}>Redefinir Senha</Heading>
            <Text style={s.paragraph}>
              Olá, <strong style={s.strong}>{firstName}</strong>! Recebemos uma
              solicitação para redefinir a senha da sua conta. Clique no botão
              abaixo para criar uma nova senha.
            </Text>
            <Text style={s.warning}>
              Se não foi você, ignore este email. Seu acesso permanece seguro.
            </Text>
          </Section>

          <Section style={s.ctaSection}>
            <Button style={s.button} href={resetUrl}>
              Redefinir Senha →
            </Button>
          </Section>

          <Hr style={s.divider} />

          <Section style={s.footer}>
            <Text style={s.footerNote}>
              Link válido por <strong>1 hora</strong>.
            </Text>
            <Text style={s.footerBrand}>MYTHARA RPG · Plataforma de RPG Online</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const s = {
  body: {
    backgroundColor: "#080f09",
    margin: "0",
    padding: "40px 16px",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  container: {
    maxWidth: "520px",
    margin: "0 auto",
    backgroundColor: "#0f1a10",
    borderRadius: "10px",
    overflow: "hidden" as const,
    border: "1px solid #1a2e1c",
  },
  topAccent: {
    backgroundColor: "#16a34a",
    height: "5px",
  },
  brandSection: {
    padding: "32px 40px 20px",
    textAlign: "center" as const,
  },
  brandName: {
    color: "#4ade80",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "8px",
    margin: "0 0 4px",
    fontFamily: "Cinzel, Georgia, serif",
    textTransform: "uppercase" as const,
  },
  brandSub: {
    color: "#16a34a",
    fontSize: "11px",
    letterSpacing: "6px",
    margin: "0",
    fontFamily: "Cinzel, Georgia, serif",
  },
  divider: {
    borderColor: "#1a2e1c",
    margin: "0",
  },
  content: {
    padding: "32px 40px 20px",
  },
  heading: {
    color: "#f0fdf4",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 16px",
    lineHeight: "1.3",
  },
  paragraph: {
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: "1.7",
    margin: "0 0 12px",
  },
  warning: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "0",
  },
  strong: {
    color: "#86efac",
  },
  ctaSection: {
    padding: "24px 40px 32px",
    textAlign: "center" as const,
  },
  button: {
    backgroundColor: "#16a34a",
    color: "#f0fdf4",
    padding: "14px 36px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
    letterSpacing: "0.3px",
  },
  footer: {
    padding: "24px 40px",
    textAlign: "center" as const,
  },
  footerNote: {
    color: "#334155",
    fontSize: "12px",
    margin: "0 0 6px",
    lineHeight: "1.6",
  },
  footerBrand: {
    color: "#1a2e1c",
    fontSize: "11px",
    letterSpacing: "2px",
    margin: "16px 0 0",
    textTransform: "uppercase" as const,
    fontFamily: "Cinzel, Georgia, serif",
  },
}
