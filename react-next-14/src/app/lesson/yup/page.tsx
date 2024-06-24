'use client'
import {Button, TextField} from "@mui/material";
import React from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
    
    confirmPassword: yup
        .string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required')
        .oneOf([yup.ref('password'),''],"password must match")
});



const Page = () => {
    const formik = useFormik({
        initialValues: {
            email: 'foobar@example.com',
            password: 'foobar',
            confirmPassword:''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    return (
        <div className="gap-4">
            <form className="gap-4" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                 <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="confirm password"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Submit
                </Button>
            </form>
        </div>
    );
};
export default Page;
