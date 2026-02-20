import React from 'react';
import Head from 'next/head';
import LoginForm from '../components/Auth/LoginForm';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Đăng nhập | Market Pulse</title>
      </Head>
      <LoginForm />
    </>
  );
}
