import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField } from '@material-ui/core';
import { gql } from '@apollo/client/core';
import { useQuery } from '@apollo/client';

const roles = [
  {
    value: 'USER',
    label: '用户'
  },
  {
    value: 'ADMIN',
    label: '管理员'
  }
];

const AccountProfileDetails = (props) => {

  const [values, setValues] = useState(props.user);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      autoComplete='off'
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader='可以于此编辑信息'
          title='资料'
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label='ID'
                name='uid'
                onChange={handleChange}
                required
                value={values.uid}
                variant='outlined'
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label='邮箱'
                name='email'
                onChange={handleChange}
                required
                value={values.email}
                variant='outlined'
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label='班级'
                name='class'
                onChange={handleChange}
                value={values.class}
                variant='outlined'
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="身份"
                name="role"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.role}
                variant="outlined"
              >
                {roles.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color='primary'
            variant='contained'
            href='someLink'
            target='_blank'
          >
            保存信息
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AccountProfileDetails;
