import { Router } from 'express';
import { GitLabService } from '../services/gitlab.service.js';
import databaseService from '../services/database.service.js';
import type { DashboardStats } from '../types/gitlab.js';

const router = Router();

// Sync data from GitLab to database
router.post('/sync', async (req, res) => {
  try {
    const { baseUrl, privateToken, groupId, projectId, since, until } = req.body;

    if (!baseUrl || !privateToken) {
      return res.status(400).json({ error: 'baseUrl and privateToken are required' });
    }

    const gitlabService = new GitLabService({ baseUrl, privateToken, groupId, projectId });

    const sinceDate = since ? new Date(since) : undefined;
    const untilDate = until ? new Date(until) : undefined;

    // Fetch and save data
    const users = await gitlabService.getActiveUsers();
    const activities = await gitlabService.collectUserActivities(users, sinceDate, untilDate);

    res.json({ success: true, message: 'Data synced successfully', usersCount: users.length });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({ error: 'Failed to sync data from GitLab' });
  }
});

// Get users from database
router.get('/users', async (req, res) => {
  try {
    const users = await databaseService.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get events from database
router.get('/events', async (req, res) => {
  try {
    const { since, until, userId } = req.query;
    const sinceDate = since ? new Date(since as string) : undefined;
    const untilDate = until ? new Date(until as string) : undefined;

    let events;
    if (userId) {
      events = await databaseService.getUserEvents(parseInt(userId as string), sinceDate, untilDate);
    } else {
      events = await databaseService.getEvents(sinceDate, untilDate);
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get projects from database
router.get('/projects', async (req, res) => {
  try {
    const projects = await databaseService.getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get dashboard statistics from database
router.get('/stats', async (req, res) => {
  try {
    const { since, until } = req.query;
    const sinceDate = since ? new Date(since as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const untilDate = until ? new Date(until as string) : new Date();

    const users = await databaseService.getUsers();
    const events = await databaseService.getEvents(sinceDate, untilDate);

    // Calculate statistics
    const commitsByDay: { [date: string]: number } = {};
    const commitsByHour: number[] = new Array(24).fill(0);
    const commitsByDayOfWeek: number[] = new Array(7).fill(0);
    const projectCommits: { [project: string]: number } = {};
    const userCommits: { [userId: number]: number } = {};

    let totalCommits = 0;

    for (const event of events) {
      if (event.action_name === 'pushed to' && event.push_data) {
        const date = new Date(event.created_at);
        const dateStr = date.toISOString().split('T')[0];
        const hour = date.getHours();
        const dayOfWeek = date.getDay();
        const commitCount = event.push_data.commit_count || 0;

        commitsByDay[dateStr] = (commitsByDay[dateStr] || 0) + commitCount;
        commitsByHour[hour] += commitCount;
        commitsByDayOfWeek[dayOfWeek] += commitCount;
        totalCommits += commitCount;

        if (event.target_title) {
          projectCommits[event.target_title] = (projectCommits[event.target_title] || 0) + commitCount;
        }

        userCommits[event.author_id] = (userCommits[event.author_id] || 0) + commitCount;
      }
    }

    // Calculate workdays
    let workdays = 0;
    const current = new Date(sinceDate);
    while (current <= untilDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) workdays++;
      current.setDate(current.getDate() + 1);
    }

    const avgCommitsPerWorkday = workdays > 0 ? totalCommits / workdays : 0;

    // Top contributors
    const topContributors = Object.entries(userCommits)
      .map(([userId, commits]) => {
        const user = users.find(u => u.id === parseInt(userId));
        return user ? { user, commits } : null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.commits || 0) - (a?.commits || 0))
      .slice(0, 10);

    // Project breakdown
    const projectBreakdown = Object.entries(projectCommits)
      .map(([project, commits]) => ({ project, commits }))
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 10);

    const stats: DashboardStats = {
      totalUsers: users.length,
      totalCommits,
      totalAdditions: 0,
      totalDeletions: 0,
      avgCommitsPerWorkday,
      commitsByDay,
      commitsByHour,
      commitsByDayOfWeek,
      topContributors: topContributors as any,
      projectBreakdown,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Failed to calculate statistics' });
  }
});

export default router;
