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

interface Skill {
  name: string;
  description: string;
  author: string;
  slug: string;
  installCount: number;
  qualityScore: number;
}

interface WeeklyDigestProps {
  skills: Skill[];
  weekNumber: number;
  year: number;
}

export default function WeeklyDigest({ skills, weekNumber, year }: WeeklyDigestProps) {
  // UTM parameters for tracking
  const utmParams = '?utm_source=email&utm_medium=weekly_digest&utm_campaign=engagement';

  return (
    <Html>
      <Head />
      <Preview>QASkills.sh Weekly Digest - Top Skills This Week</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>QASkills Weekly Digest 📊</Heading>
          <Text style={subtitle}>
            Week {weekNumber}, {year}
          </Text>

          <Text style={text}>
            Here are the top QA testing skills from the past week, ranked by popularity and
            quality:
          </Text>

          {skills.map((skill, index) => (
            <Section key={skill.slug} style={skillCard}>
              <div style={rankBadge}>#{index + 1}</div>
              <Heading style={skillTitle}>{skill.name}</Heading>
              <Text style={skillDescription}>{skill.description}</Text>
              <Text style={skillMeta}>
                by {skill.author} • {skill.installCount} installs • Quality: {skill.qualityScore}%
              </Text>
              <Button
                style={skillButton}
                href={`https://qaskills.sh/skills/${skill.author}/${skill.slug}${utmParams}&utm_content=skill_rank_${index + 1}`}
              >
                View Details
              </Button>
            </Section>
          ))}

          <Section style={ctaSection}>
            <Text style={text}>Ready to supercharge your AI agent's QA capabilities?</Text>
            <Button style={button} href={`https://qaskills.sh/skills${utmParams}`}>
              Browse All Skills
            </Button>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            You're receiving this weekly digest because you opted in.
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
  margin: '40px 0 10px',
  padding: '0 48px',
};

const subtitle = {
  color: '#666',
  fontSize: '14px',
  margin: '0 0 20px 0',
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
  position: 'relative' as const,
};

const rankBadge = {
  position: 'absolute' as const,
  top: '12px',
  right: '12px',
  backgroundColor: '#007bff',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '4px',
};

const skillTitle = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const skillDescription = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 12px 0',
};

const skillMeta = {
  color: '#888',
  fontSize: '12px',
  margin: '0 0 16px 0',
};

const skillButton = {
  backgroundColor: '#007bff',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '8px 16px',
};

const ctaSection = {
  padding: '20px 48px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#007bff',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '20px 0',
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
  textAlign: 'center' as const,
};
