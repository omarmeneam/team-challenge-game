import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import TeamDashboard from '../../components/TeamDashboard';
import { useHelpAid } from '../../store/slices/teamsSlice';

// Mock Redux store
const mockStore = configureStore([thunk]);

// Mock Supabase subscription
jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    channel: () => ({
      on: () => ({
        subscribe: jest.fn()
      })
    })
  }
}));

// Mock initial state
const initialState = {
  teams: {
    currentTeam: {
      id: '1',
      name: 'Test Team',
      score: 500,
      streak: 2,
      skip_aids_remaining: 3,
      fifty_fifty_aids_remaining: 2,
      time_freeze_aids_remaining: 1
    }
  },
  game: {
    timeRemaining: 30,
    currentQuestion: {
      id: '1',
      question: 'Test Question',
      difficulty: 'medium'
    }
  }
};

describe('TeamDashboard Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  test('renders team information correctly', () => {
    render(
      <Provider store={store}>
        <TeamDashboard />
      </Provider>
    );

    expect(screen.getByText('Test Team')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Streak: 2')).toBeInTheDocument();
  });

  test('displays correct number of help aids', () => {
    render(
      <Provider store={store}>
        <TeamDashboard />
      </Provider>
    );

    expect(screen.getByText('Skip: 3')).toBeInTheDocument();
    expect(screen.getByText('50:50: 2')).toBeInTheDocument();
    expect(screen.getByText('Time Freeze: 1')).toBeInTheDocument();
  });

  test('help aid buttons are disabled when none remaining', () => {
    const stateWithNoAids = {
      ...initialState,
      teams: {
        currentTeam: {
          ...initialState.teams.currentTeam,
          skip_aids_remaining: 0,
          fifty_fifty_aids_remaining: 0,
          time_freeze_aids_remaining: 0
        }
      }
    };
    store = mockStore(stateWithNoAids);

    render(
      <Provider store={store}>
        <TeamDashboard />
      </Provider>
    );

    const skipButton = screen.getByRole('button', { name: /skip/i });
    const fiftyFiftyButton = screen.getByRole('button', { name: /50:50/i });
    const timeFreezeButton = screen.getByRole('button', { name: /freeze/i });

    expect(skipButton).toBeDisabled();
    expect(fiftyFiftyButton).toBeDisabled();
    expect(timeFreezeButton).toBeDisabled();
  });

  test('dispatches useHelpAid action when aid button clicked', async () => {
    render(
      <Provider store={store}>
        <TeamDashboard />
      </Provider>
    );

    const skipButton = screen.getByRole('button', { name: /skip/i });
    fireEvent.click(skipButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: useHelpAid.pending.type
        })
      );
    });
  });

  test('updates streak multiplier display', () => {
    render(
      <Provider store={store}>
        <TeamDashboard />
      </Provider>
    );

    // 2 streak = 1.4x multiplier
    expect(screen.getByText('1.4x')).toBeInTheDocument();
  });

  test('displays streak bonus animation on score update', async () => {
    const { rerender } = render(
      <Provider store={store}>
        <TeamDashboard />
      </Provider>
    );

    // Update store with new score
    const updatedState = {
      ...initialState,
      teams: {
        currentTeam: {
          ...initialState.teams.currentTeam,
          score: 700,
          streak: 3
        }
      }
    };
    store = mockStore(updatedState);

    rerender(
      <Provider store={store}>
        <TeamDashboard />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('700')).toBeInTheDocument();
      expect(screen.getByText('Streak: 3')).toBeInTheDocument();
      expect(screen.getByText('1.6x')).toBeInTheDocument();
    });
  });
});