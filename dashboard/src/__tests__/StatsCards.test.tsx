import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCards } from '../components/StatsCards';

describe('StatsCards', () => {
  it('renders all stat cards', () => {
    render(
      <StatsCards
        totalUsers={10}
        totalCommits={100}
        totalAdditions={500}
        totalDeletions={200}
        avgCommitsPerWorkday={5.5}
      />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Total Commits')).toBeInTheDocument();
    expect(screen.getByText('Avg Commits/Workday')).toBeInTheDocument();
    expect(screen.getByText('Lines Added')).toBeInTheDocument();
    expect(screen.getByText('Lines Deleted')).toBeInTheDocument();
  });

  it('displays correct values', () => {
    render(
      <StatsCards
        totalUsers={10}
        totalCommits={100}
        totalAdditions={500}
        totalDeletions={200}
        avgCommitsPerWorkday={5.5}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('5.5')).toBeInTheDocument();
  });

  it('formats large numbers with locale string', () => {
    render(
      <StatsCards
        totalUsers={1}
        totalCommits={1}
        totalAdditions={1234567}
        totalDeletions={987654}
        avgCommitsPerWorkday={1}
      />
    );

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
    expect(screen.getByText('987,654')).toBeInTheDocument();
  });

  it('formats average commits per workday to 1 decimal place', () => {
    render(
      <StatsCards
        totalUsers={1}
        totalCommits={1}
        totalAdditions={1}
        totalDeletions={1}
        avgCommitsPerWorkday={3.456789}
      />
    );

    expect(screen.getByText('3.5')).toBeInTheDocument();
  });

  it('renders with zero values', () => {
    render(
      <StatsCards
        totalUsers={0}
        totalCommits={0}
        totalAdditions={0}
        totalDeletions={0}
        avgCommitsPerWorkday={0}
      />
    );

    // Check for multiple "0" values
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThan(0);
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });
});
