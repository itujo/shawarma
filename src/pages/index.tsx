/* eslint-disable no-alert */
import { FormEvent, useState } from 'react';
import useSWR from 'swr';

interface Transporter {
  id: number;
  name: string;
}

const Index = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());

  const { data: transporters, error } = useSWR(
    `${apiUrl}/transporter`,
    fetcher
  );

  const [csv, setCsv] = useState<File | null>(null);

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    const { transporter } = event.target as EventTarget & {
      transporter: {
        value: string;
      };
    };

    const transporterId = parseInt(transporter.value, 10);

    const body = new FormData();

    if (!csv) {
      alert('select a file');
      return;
    }
    body.append('file', csv);

    const response = await fetch(`${apiUrl}/movement/import/${transporterId}`, {
      method: 'POST',
      body,
    });

    const res = await response.json();
    alert(res.message);
  };

  if (error) return <div>failed to load</div>;
  if (!transporters) return <div>loading...</div>;
  return (
    <div className='container mx-auto w-full max-w-md content-center mt-40'>
      <div className='title'>
        <h1 className='text-lg text-center'>importar csv</h1>
      </div>

      <main>
        <form
          className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
          onSubmit={submitForm}
        >
          <div className='mb-4'>
            <label
              htmlFor='transporter'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Selecione a transportadora
              <div className='inline-block relative w-64'>
                <select
                  id='transporter'
                  name='transporter'
                  className='block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline'
                >
                  {transporters.map((transporter: Transporter) => (
                    <option key={transporter.id} value={transporter.id}>
                      {transporter.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>
          <div className='mb-4'>
            <label
              htmlFor='file'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Selecione o arquivo
              <div>
                <input
                  type='file'
                  name='file'
                  id='file'
                  accept='.csv'
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  onChange={(event) => {
                    if (event.target.files && event.target.files[0]) {
                      setCsv(event.target.files[0]);
                    }
                  }}
                />
              </div>
            </label>
          </div>

          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'
          >
            enviar
          </button>
        </form>
      </main>
    </div>
  );
};

export default Index;
