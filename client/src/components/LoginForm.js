import React from 'react';
import { Field, reduxForm } from 'redux-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const validate = values => {
    const errors = {}
    const requiredFields = [
        'email',
        'password'
    ]
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }
    return errors
}
const renderTextField = ({
    label,
    input,
    meta: { touched, invalid, error },
    ...custom
}) => (
        <TextField
            label={label}
            placeholder={label}
            error={touched && invalid}
            helperText={touched && error}
            {...input}
            {...custom}
        />
    )

function LoginForm(props) {
    const { handleSubmit } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Field name="email" component={renderTextField} label="Email" type="email" fullWidth/>
            </div>
            <div>
                <Field name="password" component={renderTextField} label="Password" type="password" fullWidth/>
            </div>
            <Button size="large" style={{marginTop: "2%"}} variant="contained" color="primary" type="submit" fullWidth>Login</Button>
        </form>
    )
}

export default reduxForm({
    form: 'login',
    validate
})(LoginForm);