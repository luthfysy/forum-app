/* eslint-disable import/extensions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-undef */
// src/components/__tests__/ThreadCard.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import ThreadCard from '../ThreadCard.jsx'; // Pastikan ada .jsx
import { postedAt } from '../../utils/index.js'; // Pastikan ada /index.js

// Mock the utils function for consistent time display in tests
jest.mock('../../utils/index.js', () => ({ // Pastikan mock path juga sesuai
  postedAt: jest.fn((date) => `posted at ${date}`),
}));

/**
 * Skenario Pengujian ThreadCard:
 * 1. ThreadCard harus merender informasi thread dengan benar.
 * 2. Tombol upvote dan downvote harus dinonaktifkan jika tidak ada authUser.
 * 3. Tombol upvote dan downvote harus aktif jika ada authUser.
 * 4. Klik tombol upvote harus memanggil onUpVote dengan ID thread yang benar.
 * 5. Klik tombol downvote harus memanggil onDownVote dengan ID thread yang benar.
 */
describe('ThreadCard Component', () => {
  const mockThread = {
    id: 'thread-1',
    title: 'Test Thread Title',
    body: 'This is a test thread body. It contains some content for testing purposes. This is a very long body that will definitely be truncated when displayed in the ThreadCard component, especially if it exceeds the 100-character limit.',
    category: 'Testing',
    createdAt: '2024-01-01T00:00:00.000Z',
    owner: {
      id: 'user-1',
      name: 'Tester A',
      avatar: 'https://test.com/avatarA.jpg',
    },
    totalComments: 5,
    upVotesBy: [],
    downVotesBy: [],
  };

  const mockAuthUser = { id: 'user-auth', name: 'Auth User' };
  const onUpVoteMock = jest.fn();
  const onDownVoteMock = jest.fn();
  const onNeutralVoteMock = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    onUpVoteMock.mockClear();
    onDownVoteMock.mockClear();
    onNeutralVoteMock.mockClear();
    postedAt.mockClear(); // Clear mock for postedAt
    postedAt.mockImplementation((date) => `posted at ${new Date(date).toLocaleDateString()}`); // Default mock for postedAt
  });

  it('should render thread information correctly', () => {
    render(
      <Router>
        <ThreadCard
          {...mockThread}
          authUser={null}
          onUpVote={onUpVoteMock}
          onDownVote={onDownVoteMock}
          onNeutralVote={onNeutralVoteMock}
        />
      </Router>,
    );

    expect(screen.getByText(mockThread.title)).toBeInTheDocument();

    // Verifikasi teks kategori
    expect(screen.getByText(mockThread.category, { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/Category:/i)).toBeInTheDocument();

    // --- PERUBAHAN DI SINI ---
    // Menggunakan regex untuk mencari bagian awal teks body yang terpotong.
    // Ini lebih robust karena tidak mengharapkan "..." secara eksplisit,
    // yang mungkin berbeda dalam rendering JSDOM.
    // Atau, kita bisa mencari substring awal dari body.
    const expectedBodyStart = mockThread.body.substring(0, 100);
    expect(screen.getByText(new RegExp(expectedBodyStart, 'i'))).toBeInTheDocument();
    // --- AKHIR PERUBAHAN ---

    expect(screen.getByText(mockThread.owner.name)).toBeInTheDocument();
    expect(screen.getByText(`posted at ${new Date(mockThread.createdAt).toLocaleDateString()}`)).toBeInTheDocument();
    expect(screen.getByText(`💬 ${mockThread.totalComments}`)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: mockThread.owner.name })).toHaveAttribute('src', mockThread.owner.avatar);
  });

  it('should disable vote buttons if no authUser', () => {
    render(
      <Router>
        <ThreadCard
          {...mockThread}
          authUser={null}
          onUpVote={onUpVoteMock}
          onDownVote={onDownVoteMock}
          onNeutralVote={onNeutralVoteMock}
        />
      </Router>,
    );

    const upVoteButton = screen.getByRole('button', { name: /👍/i });
    const downVoteButton = screen.getByRole('button', { name: /👎/i });

    expect(upVoteButton).toBeDisabled();
    expect(downVoteButton).toBeDisabled();
  });

  it('should enable vote buttons if authUser exists', () => {
    render(
      <Router>
        <ThreadCard
          {...mockThread}
          authUser={mockAuthUser}
          onUpVote={onUpVoteMock}
          onDownVote={onDownVoteMock}
          onNeutralVote={onNeutralVoteMock}
        />
      </Router>,
    );

    const upVoteButton = screen.getByRole('button', { name: /👍/i });
    const downVoteButton = screen.getByRole('button', { name: /👎/i });

    expect(upVoteButton).not.toBeDisabled();
    expect(downVoteButton).not.toBeDisabled();
  });

  it('should call onUpVote when upvote button is clicked and not already upvoted', () => {
    render(
      <Router>
        <ThreadCard
          {...mockThread}
          authUser={mockAuthUser}
          onUpVote={onUpVoteMock}
          onDownVote={onDownVoteMock}
          onNeutralVote={onNeutralVoteMock}
        />
      </Router>,
    );

    const upVoteButton = screen.getByRole('button', { name: /👍/i });
    fireEvent.click(upVoteButton);

    expect(onUpVoteMock).toHaveBeenCalledTimes(1);
    expect(onUpVoteMock).toHaveBeenCalledWith(mockThread.id);
    expect(onNeutralVoteMock).not.toHaveBeenCalled(); // Should not call neutral if not already upvoted
  });

  it('should call onNeutralVote when upvote button is clicked and already upvoted', () => {
    const threadWithUpVote = { ...mockThread, upVotesBy: [mockAuthUser.id] };
    render(
      <Router>
        <ThreadCard
          {...threadWithUpVote}
          authUser={mockAuthUser}
          onUpVote={onUpVoteMock}
          onDownVote={onDownVoteMock}
          onNeutralVote={onNeutralVoteMock}
        />
      </Router>,
    );

    const upVoteButton = screen.getByRole('button', { name: /👍/i });
    fireEvent.click(upVoteButton);

    expect(onNeutralVoteMock).toHaveBeenCalledTimes(1);
    expect(onNeutralVoteMock).toHaveBeenCalledWith(mockThread.id);
    expect(onUpVoteMock).not.toHaveBeenCalled(); // Should not call upvote again
  });

  it('should call onDownVote when downvote button is clicked and not already downvoted', () => {
    render(
      <Router>
        <ThreadCard
          {...mockThread}
          authUser={mockAuthUser}
          onUpVote={onUpVoteMock}
          onDownVote={onDownVoteMock}
          onNeutralVote={onNeutralVoteMock}
        />
      </Router>,
    );

    const downVoteButton = screen.getByRole('button', { name: /👎/i });
    fireEvent.click(downVoteButton);

    expect(onDownVoteMock).toHaveBeenCalledTimes(1);
    expect(onDownVoteMock).toHaveBeenCalledWith(mockThread.id);
    expect(onNeutralVoteMock).not.toHaveBeenCalled(); // Should not call neutral if not already downvoted
  });

  it('should call onNeutralVote when downvote button is clicked and already downvoted', () => {
    const threadWithDownVote = { ...mockThread, downVotesBy: [mockAuthUser.id] };
    render(
      <Router>
        <ThreadCard
          {...threadWithDownVote}
          authUser={mockAuthUser}
          onUpVote={onUpVoteMock}
          onDownVote={onDownVoteMock}
          onNeutralVote={onNeutralVoteMock}
        />
      </Router>,
    );

    const downVoteButton = screen.getByRole('button', { name: /👎/i });
    fireEvent.click(downVoteButton);

    expect(onNeutralVoteMock).toHaveBeenCalledTimes(1);
    expect(onNeutralVoteMock).toHaveBeenCalledWith(mockThread.id);
    expect(onDownVoteMock).not.toHaveBeenCalled(); // Should not call downvote again
  });
});
