# Contributing to GitLab Activity Dashboard

Thank you for your interest in contributing to the GitLab Activity Dashboard! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project follows a Code of Conduct that we expect all contributors to adhere to:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Assume good intentions
- Respect differing viewpoints and experiences

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/github-committer-report.git
   cd github-committer-report
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Re4zOon/github-committer-report.git
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Installation

1. Install dependencies for both frontend and backend:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../dashboard
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

3. Start PostgreSQL (or use Docker):
   ```bash
   docker-compose up -d postgres
   ```

4. Run the application:
   ```bash
   # Backend (in one terminal)
   cd backend
   npm run dev
   
   # Frontend (in another terminal)
   cd dashboard
   npm run dev
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes**: Fix issues or errors in the code
- **Features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize code for better performance
- **Refactoring**: Improve code structure without changing behavior
- **UI/UX**: Enhance the user interface

### Before You Start

1. **Check existing issues**: Look for related issues or discussions
2. **Create an issue**: For major changes, create an issue first to discuss
3. **Ask questions**: Not sure about something? Ask in the issue comments

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define proper types (avoid `any`)
- Use interfaces for object shapes

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use trailing commas in multi-line objects/arrays
- Keep lines under 100 characters when possible

### Naming Conventions

- **Files**: Use kebab-case (e.g., `user-service.ts`)
- **Components**: Use PascalCase (e.g., `UserProfile.tsx`)
- **Functions**: Use camelCase (e.g., `getUserData`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces**: Use PascalCase (e.g., `UserData`)

### Comments

- Write clear, descriptive comments for complex logic
- Use JSDoc for public functions and classes
- Keep comments up-to-date with code changes
- Avoid obvious comments

Example:
```typescript
/**
 * Fetches user activities from GitLab API
 * @param userId - The GitLab user ID
 * @param since - Start date for activity range
 * @param until - End date for activity range
 * @returns Array of user activities
 */
async function getUserActivities(
  userId: number,
  since?: Date,
  until?: Date
): Promise<UserActivity[]> {
  // Implementation
}
```

### File Structure

#### Backend
```
backend/src/
├── config/          # Configuration files
├── routes/          # Express routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── __tests__/       # Tests
```

#### Frontend
```
dashboard/src/
├── components/      # React components
├── services/        # API services
├── types/           # TypeScript type definitions
└── __tests__/       # Tests
```

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Maintain or improve test coverage
- Use descriptive test names
- Follow the AAA pattern: Arrange, Act, Assert

### Running Tests

```bash
# Backend tests
cd backend
npm test                  # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage

# Frontend tests
cd dashboard
npm test                  # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

### Test Examples

**Backend Test**:
```typescript
describe('GitLabService', () => {
  it('should fetch active users', async () => {
    // Arrange
    const service = new GitLabService(mockConfig);
    
    // Act
    const users = await service.getActiveUsers();
    
    // Assert
    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);
  });
});
```

**Frontend Test**:
```tsx
describe('StatsCards', () => {
  it('renders all stat cards', () => {
    // Arrange & Act
    render(<StatsCards totalUsers={10} totalCommits={100} />);
    
    // Assert
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
```

## Submitting Changes

### Commit Messages

Use clear, descriptive commit messages following this format:

```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `style`: Code style changes (formatting, etc.)
- `chore`: Maintenance tasks

**Examples**:
```bash
feat: add user filtering to dashboard

Add ability to filter dashboard by specific users.
Users can select multiple users from a dropdown.

Closes #123

---

fix: resolve CORS error on API requests

Update CORS middleware to allow requests from
the frontend development server.

---

docs: update setup guide with Docker instructions

Add detailed Docker setup instructions and
troubleshooting tips.
```

### Pull Request Process

1. **Update your fork**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**:
   ```bash
   cd backend && npm test
   cd ../dashboard && npm test
   ```

3. **Lint your code**:
   ```bash
   cd dashboard && npm run lint
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**:
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Link related issues

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tests pass locally
- [ ] Added/updated tests
- [ ] Manually tested

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests with good coverage
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Reporting Bugs

### Before Reporting

1. **Search existing issues**: Check if the bug is already reported
2. **Try the latest version**: Ensure you're using the latest code
3. **Reproduce the bug**: Make sure you can consistently reproduce it

### Bug Report Template

```markdown
## Bug Description
A clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., macOS 13.0]
- Node.js: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]
- PostgreSQL: [e.g., 16.1]

## Additional Context
Any other relevant information
```

## Suggesting Enhancements

### Enhancement Template

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples, or other relevant information
```

## Development Tips

### Useful Commands

```bash
# Watch backend for changes
cd backend && npm run dev

# Watch frontend for changes
cd dashboard && npm run dev

# Build for production
cd backend && npm run build
cd dashboard && npm run build

# Run linter
cd dashboard && npm run lint

# View test UI
cd backend && npm run test:ui
cd dashboard && npm run test:ui
```

### Debugging

#### Backend
- Use `console.log()` or a debugger
- Check backend console for errors
- Inspect database with `psql`

#### Frontend
- Use browser DevTools (F12)
- Check Console for errors
- Use Network tab to inspect API calls
- Use React DevTools

## Questions?

If you have questions:

1. Check the [documentation](./docs/)
2. Search [existing issues](https://github.com/Re4zOon/github-committer-report/issues)
3. Create a new issue with the "question" label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! 🎉
