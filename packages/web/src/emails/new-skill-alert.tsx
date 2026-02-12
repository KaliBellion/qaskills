import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface NewSkillAlertProps {
  skillName: string;
  skillDescription: string;
  skillAuthor: string;
  skillSlug: string;
  authorName: string;
}

export default function NewSkillAlert({
  skillName,
  skillDescription,
  skillAuthor,
  skillSlug,
  authorName,
}: NewSkillAlertProps) {
  // UTM parameters for tracking
  const utmParams = '?utm_source=email&utm_medium=skill_alert&utm_campaign=new_skill';
  const skillUrl = `https://qaskills.sh/skills/${skillAuthor}/${skillSlug}${utmParams}`;

  return (
    <Html>
      <Head />
      <Preview>New QA Skill: {skillName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New QA Skill Available 🚀</Heading>

          <Text style={text}>A new skill has been published on QASkills.sh:</Text>

          <Section style={skillCard}>
            <Heading style={skillTitle}>{skillName}</Heading>
            <Text style={skillDescriptionStyle}>{skillDescription}</Text>
            <Text style={skillAuthorStyle}>by {authorName}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={skillUrl}>
              View Skill Details
            </Button>
          </Section>

          <Section style={codeBlock}>
            <Text style={codeLabel}>Quick Install:</Text>
            <code style={code}>npx @qaskills/cli add {skillSlug}</code>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            You're receiving this because you opted in to new skill alerts.
            <br />
            <Link href={`https://qaskills.sh/dashboard/preferences${utmParams}`} style={link}>
              Update Email Preferences
            </Link>{' '}
            |{' '}
            <Link href={`https://qaskills.sh/unsubscribe${utmParams}`} style={link}>
              Unsubscribe
            </Link>
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
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
};

const skillCard = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '24px',
  margin: '20px 48px',
  border: '1px solid #e9ecef',
};

const skillTitle = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const skillDescriptionStyle = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 12px 0',
};

const skillAuthorStyle = {
  color: '#888',
  fontSize: '13px',
  margin: '0',
};

const buttonContainer = {
  padding: '27px 48px',
};

const button = {
  backgroundColor: '#007bff',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const codeBlock = {
  backgroundColor: '#f1f3f5',
  borderRadius: '6px',
  padding: '16px',
  margin: '20px 48px',
};

const codeLabel = {
  color: '#666',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
};

const code = {
  color: '#d63384',
  fontFamily: 'monospace',
  fontSize: '14px',
  display: 'block',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 48px',
};

const link = {
  color: '#007bff',
  textDecoration: 'underline',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
};
