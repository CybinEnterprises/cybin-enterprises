# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Main    | ✅                 |
| Develop | ✅                 |

## Reporting a VulnerabilityPlease report security vulnerabilities to security@cybin-enterprises.com rather than using the public issue tracker.

We will acknowledge receipt of your report within 24 hours and will provide a detailed response within 7 days indicating how we are handling the vulnerability.

Please include:
- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting)
- Full paths of source file(s) related to the manifestation of the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Preferred Languages

We prefer all communications to be in English.

## Security Considerations in this Project### Authentication
- Uses Internet Identity for phishing-resistant authentication
- No password storage or transmission- Principal-based authorization model

### Data Protection- Client-side encryption for sensitive files
- HTTPS enforced for all communications
- Input validation and sanitization on both client and server

### Application Security
- Content Security Policy headers recommended for production- Automatic XSS protection via React
- CSRF protection via Internet Identity
- Dependency vulnerability scanning

### Dependencies
- Regular automated dependency updates
- Vulnerability scanning in CI pipeline- License compliance checking

## Security Updates

Security updates will be released as needed and announced through:
- GitHub Security Advisories
- Release notes
- Direct contact for critical issues affecting enterprise customers

## Acknowledgments

We follow responsible disclosure practices and appreciate the security community's help in keeping our products secure.