import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
// Import language components
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';

/**
 * Format message content by detecting and highlighting code blocks
 * @param {string} content - The raw message content
 * @returns {string} HTML string with formatted code blocks
 */
export function formatContent(content) {
    // Regular expression to match code blocks with language specification
    // Format: ```language\ncode\n```
    const codeBlockRegex = /```(sql|java|python|json)\n([\s\S]*?)\n```/gi;
    console.log('formatContent '+content)
    // Replace code blocks with highlighted versions
    return content && content.replace(codeBlockRegex, (match, language, code) => {
        let formattedCode;

        try {
            // Normalize language name
            const normalizedLang = language.toLowerCase();
            // Highlight the code with Prism
            formattedCode = Prism.highlight(
                code,
                Prism.languages[normalizedLang],
                normalizedLang
            );
        } catch (error) {
            console.error('Error highlighting code:', error);
            formattedCode = code; // Fallback to plain text
        }

        return `
      <div class="code-block ${language}-block">
        <div class="code-header">
          <span class="language-badge">${language}</span>
        </div>
        <pre class="language-${language}"><code class="language-${language}">${formattedCode}</code></pre>
      </div>
    `;
    });
}

/**
 * CSS for styling the code blocks
 */
export const codeBlockStyles = `
.code-block {
  margin: 1rem 0;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.code-header {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
}

.language-badge {
  font-size: 0.8rem;
  font-weight: 500;
  color: #555;
  text-transform: uppercase;
}

pre.language-sql,
pre.language-java,
pre.language-python,
pre.language-json {
  margin: 0;
  padding: 1rem;
  max-height: 400px;
  overflow: auto;
}

.sql-block .code-header {
  background: #f0f7ff;
}

.java-block .code-header {
  background: #fff7f0;
}

.python-block .code-header {
  background: #f0fff4;
}

.json-block .code-header {
  background: #f7f0ff;
}
`;