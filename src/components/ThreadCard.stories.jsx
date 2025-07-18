/* eslint-disable no-trailing-spaces */
// src/components/ThreadCard.stories.jsx
/* eslint-disable no-multi-spaces */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react';
// HAPUS BARIS INI SECARA MUTLAK: import { MemoryRouter } from 'react-router-dom';
import ThreadCard from './ThreadCard'; 

const mockPostedAt = (date) => {
  const posted = new Date(date);
  return `posted at ${posted.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
};

export default {
  title: 'Components/ThreadCard',
  component: ThreadCard,
  tags: ['autodocs'],
  // HAPUS BLOK DECORATORS INI SECARA MUTLAK
  // decorators: [
  //   (Story) => (
  //     <MemoryRouter>
  //       <Story />
  //     </MemoryRouter>
  //   ),
  // ],
  
  args: {
    id: 'thread-1',
    title: 'Contoh Judul Thread',
    body: 'Ini adalah isi thread yang sangat panjang untuk menguji pemotongan teks. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'general',
    createdAt: '2024-07-17T10:00:00.000Z',
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
    },
    totalComments: 10,
    upVotesBy: [],
    downVotesBy: [],
    authUser: null,
    onUpVote: (id) => console.log(`Upvoted thread: ${id}`),
    onDownVote: (id) => console.log(`Downvoted thread: ${id}`),
    onNeutralVote: (id) => console.log(`Neutral voted thread: ${id}`),
  },
  
  argTypes: {
    body: { control: 'text', description: 'Isi thread (akan dipotong jika terlalu panjang)' },
    createdAt: { control: 'text', description: 'Timestamp thread dibuat' },
    authUser: { control: 'object', description: 'Objek user yang sedang login (untuk status vote)' },
  },
  
  // UBAH RENDER FUNCTION UNTUK TIDAK MEMBUNGKUS DENGAN MemoryRouter
  render: (args) => (
    <ThreadCard {...args} postedAt={mockPostedAt} />
  ),
};

export const Default = {};
export const LoggedInUser = {
  args: { authUser: { id: 'user-auth', name: 'Auth User' } },
};
export const UpVotedByLoggedInUser = {
  args: {
    authUser: { id: 'user-auth', name: 'Auth User' },
    upVotesBy: ['user-auth'],
  },
};
export const DownVotedByLoggedInUser = {
  args: {
    authUser: { id: 'user-auth', name: 'Auth User' },
    downVotesBy: ['user-auth'],
  },
};
export const WithLongTitle = {
  args: {
    title: 'Ini adalah Judul Thread yang Sangat Panjang Sekali untuk Menguji Batas Karakter yang Mungkin Ada',
  },
};
