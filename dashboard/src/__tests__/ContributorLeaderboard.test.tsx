import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContributorLeaderboard } from '../components/ContributorLeaderboard';

describe('ContributorLeaderboard', () => {
  const mockContributors = [
    {
      user: {
        id: 1,
        username: 'user1',
        name: 'User One',
        avatar_url: 'https://example.com/avatar1.jpg',
        state: 'active',
        web_url: 'https://gitlab.com/user1',
      },
      commits: 100,
    },
    {
      user: {
        id: 2,
        username: 'user2',
        name: 'User Two',
        avatar_url: 'https://example.com/avatar2.jpg',
        state: 'active',
        web_url: 'https://gitlab.com/user2',
      },
      commits: 50,
    },
    {
      user: {
        id: 3,
        username: 'user3',
        name: 'User Three',
        avatar_url: 'https://example.com/avatar3.jpg',
        state: 'active',
        web_url: 'https://gitlab.com/user3',
      },
      commits: 25,
    },
  ];

  it('renders leaderboard title', () => {
    render(<ContributorLeaderboard topContributors={mockContributors} />);
    expect(screen.getByText(/Top Contributors/i)).toBeInTheDocument();
  });

  it('renders all contributors', () => {
    render(<ContributorLeaderboard topContributors={mockContributors} />);
    
    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
    expect(screen.getByText('User Three')).toBeInTheDocument();
  });

  it('displays commit counts', () => {
    render(<ContributorLeaderboard topContributors={mockContributors} />);
    
    expect(screen.getByText('100 commits')).toBeInTheDocument();
    expect(screen.getByText('50 commits')).toBeInTheDocument();
    expect(screen.getByText('25 commits')).toBeInTheDocument();
  });

  it('renders empty state when no contributors', () => {
    render(<ContributorLeaderboard topContributors={[]} />);
    expect(screen.getByText(/Top Contributors/i)).toBeInTheDocument();
  });

  it('displays usernames with @ prefix', () => {
    render(<ContributorLeaderboard topContributors={mockContributors} />);
    
    expect(screen.getByText('@user1')).toBeInTheDocument();
    expect(screen.getByText('@user2')).toBeInTheDocument();
    expect(screen.getByText('@user3')).toBeInTheDocument();
  });
});
