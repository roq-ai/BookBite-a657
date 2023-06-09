import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getRestaurantById, updateRestaurantById } from 'apiSdk/restaurants';
import { Error } from 'components/error';
import { restaurantValidationSchema } from 'validationSchema/restaurants';
import { RestaurantInterface } from 'interfaces/restaurant';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { feedbackValidationSchema } from 'validationSchema/feedbacks';
import { menuValidationSchema } from 'validationSchema/menus';
import { orderValidationSchema } from 'validationSchema/orders';
import { promotionValidationSchema } from 'validationSchema/promotions';
import { staffValidationSchema } from 'validationSchema/staff';

function RestaurantEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RestaurantInterface>(() => `/restaurants/${id}`, getRestaurantById);
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RestaurantInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRestaurantById(id, values);
      mutate(updated);
      resetForm();
      router.push('/restaurants');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RestaurantInterface>({
    initialValues: data,
    validationSchema: restaurantValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Restaurant
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="location" mb="4" isInvalid={!!formik.errors.location}>
              <FormLabel>Location</FormLabel>
              <Input type="text" name="location" value={formik.values.location} onChange={formik.handleChange} />
              {formik.errors.location && <FormErrorMessage>{formik.errors.location}</FormErrorMessage>}
            </FormControl>
            <FormControl id="contact_info" mb="4" isInvalid={!!formik.errors.contact_info}>
              <FormLabel>Contact Information</FormLabel>
              <Input
                type="text"
                name="contact_info"
                value={formik.values.contact_info}
                onChange={formik.handleChange}
              />
              {formik.errors.contact_info && <FormErrorMessage>{formik.errors.contact_info}</FormErrorMessage>}
            </FormControl>
            <FormControl id="operating_hours" mb="4" isInvalid={!!formik.errors.operating_hours}>
              <FormLabel>Operating Hours</FormLabel>
              <Input
                type="text"
                name="operating_hours"
                value={formik.values.operating_hours}
                onChange={formik.handleChange}
              />
              {formik.errors.operating_hours && <FormErrorMessage>{formik.errors.operating_hours}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'owner_id'}
              label={'Owner'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.id}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default RestaurantEditPage;
