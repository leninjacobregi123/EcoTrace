# Contributing to EcoTrace

First off, thank you for considering contributing to EcoTrace! It's people like you that help make EcoTrace a great tool for environmental accountability.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. We pledge to make participation in our project and community a harassment-free experience for everyone.

### Our Standards

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, Python version, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues for beginners
- `help wanted` - Issues where we need community help
- `documentation` - Documentation improvements

---

## Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/ecotrace.git
cd ecotrace
git remote add upstream https://github.com/ORIGINAL_OWNER/ecotrace.git
```

### Backend Setup

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Dev dependencies
playwright install chromium
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Start Development Services

```bash
# Start databases
docker-compose up -d elasticsearch neo4j mongodb

# Start backend (in backend directory)
uvicorn api.main:app --reload

# Start frontend (in frontend directory)
npm run dev
```

---

## Coding Standards

### Python (Backend)

- Follow [PEP 8](https://peps.python.org/pep-0008/) style guide
- Use type hints for function signatures
- Maximum line length: 100 characters
- Use meaningful variable and function names
- Write docstrings for all public functions and classes

```python
def extract_claims(response: Response, company: dict) -> Iterator[SustainabilityClaimItem]:
    """
    Extract sustainability claims from HTML content.

    Args:
        response: Scrapy response object
        company: Company information dictionary

    Yields:
        SustainabilityClaimItem: Extracted claim items
    """
    # Implementation...
```

**Tools:**
```bash
# Format code
black backend/

# Lint code
flake8 backend/

# Type checking
mypy backend/

# Run all checks
make lint  # If Makefile is configured
```

### JavaScript/React (Frontend)

- Use modern ES6+ syntax
- Use functional components with hooks
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use meaningful component and variable names
- Keep components small and focused

```javascript
// Good
const CompanyCard = ({ company, onSelect }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="company-card">
      {/* Component content */}
    </div>
  );
};

// Bad
const comp = (props) => {
  return <div>{props.data.map(x => <span>{x}</span>)}</div>;
};
```

**Tools:**
```bash
# Lint code
npm run lint

# Format code
npm run format

# Run all checks
npm run check
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, no code change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(crawler): add Playwright integration for JavaScript rendering

- Added Playwright middleware to Scrapy
- Configured browser automation settings
- Updated spider to handle dynamic content

Closes #123
```

```
fix(api): resolve MongoDB pipeline boolean comparison bug

Changed `if not self.db` to `if self.db is None` to fix
MongoDB Database object boolean comparison error.

Fixes #456
```

---

## Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, documented code
   - Follow coding standards
   - Add tests for new features
   - Update documentation

3. **Test Your Changes**
   ```bash
   # Backend
   pytest tests/ -v

   # Frontend
   npm test
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link related issues
   - Request review

7. **Code Review**
   - Address review comments
   - Make requested changes
   - Push updates to your branch

8. **Merge**
   - Once approved, a maintainer will merge your PR
   - Delete your feature branch after merge

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added for new features
- [ ] All tests passing
- [ ] PR title is descriptive
- [ ] PR description explains changes

---

## Testing

### Backend Tests

```bash
# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=backend --cov-report=html

# Run specific test file
pytest tests/test_crawler.py -v
```

### Frontend Tests

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

---

## Documentation

- Update README.md if adding features
- Add docstrings to Python functions
- Add JSDoc comments to JavaScript functions
- Update API documentation in `/docs/api/`
- Add examples for new features

---

## Questions?

- **Discord**: Join our community (link)
- **GitHub Discussions**: Ask questions
- **Email**: dev@ecotrace.com

---

## Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- Annual contributor spotlight

---

## License

By contributing to EcoTrace, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to a more transparent and sustainable future! 🌍💚
