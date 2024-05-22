import { FormEvent, useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSessionContext } from '../contexts/session';
import RequiredLogin from './required-login';

const LIGHT =
  'py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700';
const SUBMIT =
  'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800';
const INPUT =
  'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nick name';
const INPUT_DISABLED =
  'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nick name cursor-not-allowed';
const isEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
const isPhone = (value: string) => /^1[3-9]\d{9}$/.test(value);

function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [editing, setEditing] = useState(false);
  const ref = useRef(null);
  const { session } = useSessionContext();

  useEffect(() => {
    (async () => {
      try {
        const info = await (await fetch('/api/local-info')).json();
        const { user } = info || {};
        if (user) {
          setFormData(user);
        }
      } catch (error) {
        // console.log(error)
      }
    })();
  }, []);

  const handleChange = (event: FormEvent) => {
    setFormData({
      ...formData,
      [(event.target as any).name]: (event.target as any).value,
    });
  };

  const updateAction = async (event: FormEvent) => {
    event.preventDefault(); // 阻止表单的默认提交行为

    if (!editing) {
      setEditing(true);
      setTimeout(() => {
        (ref.current as any).focus();
      });
      return;
    }

    const { email, phone } = formData;
    if (!isEmail(email)) {
      toast.error('Email is not valid');
      return;
    }

    if (!isPhone(phone)) {
      toast.error('Phone number is not valid');
      return;
    }

    try {
      setEditing(false);
      await fetch('/api/local-info', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInfo: formData }),
      });

      toast.success('Data submit successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };
  if (!session.user) {
    return <RequiredLogin />;
  }
  return (
    <div>
      <ToastContainer />
      <form className="max-w-sm mx-auto" onSubmit={updateAction}>
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your name
            <input
              ref={ref}
              type="text"
              id="name"
              name="name"
              className={editing ? INPUT : INPUT_DISABLED}
              placeholder="Nick name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={!editing}
            />
          </label>
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your email
            <input
              type="email"
              name="email"
              id="email"
              className={editing ? INPUT : INPUT_DISABLED}
              placeholder="name@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={!editing}
            />
          </label>
        </div>
        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your phone
            <input
              type="number"
              id="phone"
              name="phone"
              className={editing ? INPUT : INPUT_DISABLED}
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={!editing}
            />
          </label>
        </div>
        <button type="submit" value="Submit" className={editing ? SUBMIT : LIGHT}>
          {editing ? 'Submit' : 'Edit'}
        </button>
      </form>
    </div>
  );
}

export default UserForm;
