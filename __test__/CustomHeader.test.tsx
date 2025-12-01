import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { CustomHeader } from './CustomHeader';

describe('CustomHeader', () => {
  const title = 'GifsApp';
  const descriptionText = 'Esto es una app de gifs';

  test('sould render the title correctly', () => {
    render(<CustomHeader title={title} />);

    expect(screen.getByText(title)).toBeDefined();
  });

  test('sould render the description when provided', () => {
    render(<CustomHeader title={title} description={descriptionText} />);

    const description = screen.getByRole('paragraph');

    expect(description).toBeDefined();
    expect(description.innerHTML).toBe(descriptionText);
  });

  test('sould not render the description when not provided', () => {
    const { container } = render(<CustomHeader title={title} />);
    const [description] = container.getElementsByTagName('p');

    expect(description).toBeFalsy();
  });
});
