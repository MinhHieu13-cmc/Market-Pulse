import React from 'react';
import Head from 'next/head';
import RegisterForm from '../components/Auth/RegisterForm';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Đăng ký | Market Pulse</title>
      </Head>
      <RegisterForm />
    </>
  );
}
