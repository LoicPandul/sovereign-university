import { Formik, FormikHelpers } from 'formik';
import { isEmpty } from 'lodash';
import { useCallback } from 'react';
import { ZodError, z } from 'zod';

import { trpc } from '@sovereign-academy/api-client';

import { Button } from '../../../atoms/Button';
import { Divider } from '../../../atoms/Divider';
import { Modal } from '../../../atoms/Modal';
import { TextInput } from '../../../atoms/TextInput';
import { useAppDispatch } from '../../../hooks';
import { userSlice } from '../../../store/slices/user.slice';
import { AuthModalState } from '../props';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  goTo: (newState: AuthModalState) => void;
}

const signinSchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
});

export const SignIn = ({ isOpen, onClose, goTo }: SignInModalProps) => {
  const dispatch = useAppDispatch();

  const login = trpc.auth.credentials.login.useMutation({
    onSuccess: (data) => {
      dispatch(
        userSlice.actions.login({
          username: data.user.username,
          accessToken: data.accessToken,
        })
      );
      onClose();
    },
  });

  const handleLogin = useCallback(
    async (
      values: {
        username: string;
        password: string;
      },
      actions: FormikHelpers<{
        username: string;
        password: string;
      }>
    ) => {
      const errors = await actions.validateForm();
      if (!isEmpty(errors)) return;
      await login.mutate(values);
    },
    [login]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} headerText="Se connecter">
      <div className="flex flex-col items-center">
        <Button className="my-5" rounded>
          Connect with LN
        </Button>
        <Divider>OR</Divider>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={handleLogin}
          validate={(values) => {
            try {
              signinSchema.parse(values);
            } catch (error) {
              if (error instanceof ZodError) {
                return error.flatten().fieldErrors;
              }
            }
          }}
        >
          {({
            touched,
            errors,
            handleBlur,
            handleChange,
            values,
            handleSubmit,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col items-center"
            >
              <TextInput
                name="username"
                labelText="Username*"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                className="mt-4 w-96"
                error={touched.username ? errors.username : null}
              />

              <TextInput
                name="password"
                type="password"
                labelText="Password*"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className="mt-4 w-96"
                error={touched.password ? errors.password : null}
              />

              <Button type="submit" className="mb-5 mt-10">
                Se connecter
              </Button>
            </form>
          )}
        </Formik>
        <p className="mb-0 text-xs">
          Vous n'avez pas encore de compte ?
          <button
            className="ml-1 cursor-pointer border-none bg-transparent text-xs underline"
            onClick={() => goTo(AuthModalState.Signup)}
          >
            Créez-en un !
          </button>
        </p>
        <p className="mb-0 mt-2 text-xs">
          <button
            className="cursor-pointer border-none bg-transparent text-xs underline"
            onClick={() => goTo(AuthModalState.PasswordReset)}
          >
            Mot de passe oublié ?
          </button>
        </p>
      </div>

      <div className="absolute -bottom-24 left-0 w-full rounded-sm bg-white px-8 py-4 text-sm">
        Le savais tu ? Pas besoin de compte pour commencer à apprendre sur
        l'Académie Bitcoin!
      </div>
    </Modal>
  );
};
