/* eslint-disable no-multi-spaces */
/* eslint-disable eol-last */
import AuthForm from './AuthForm'; // Sesuaikan path jika berbeda

// Konfigurasi default untuk Storybook
export default {
  title: 'Components/AuthForm', // Nama di sidebar Storybook
  component: AuthForm,         // Komponen yang akan di-render
  // eslint-disable-next-line no-multi-spaces
  tags: ['autodocs'],          // Mengaktifkan fitur auto-generated docs
  parameters: {
    layout: 'centered',        // Menempatkan komponen di tengah canvas
  },
  // Mendefinisikan kontrol untuk props
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['login', 'register'], // Pilihan dropdown untuk prop 'type'
    },
    onSubmit: { action: 'submitted' }, // Menampilkan event 'submitted' di tab Actions
  },
};

// Story untuk formulir Login
export const LoginForm = {
  args: {
    type: 'login',
    onSubmit: (data) => alert(`Login submitted: ${JSON.stringify(data)}`),
  },
};

// Story untuk formulir Register
export const RegisterForm = {
  args: {
    type: 'register',
    onSubmit: (data) => alert(`Register submitted: ${JSON.stringify(data)}`),
  },
};