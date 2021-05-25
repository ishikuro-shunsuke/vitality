# Vitality

## Build Setup

```bash
# install dependencies
$ yarn install

# configure aws
$ cat > aws-exports << EOF
// prettier-ignore
export default {
  aws_cognito_region: "us-west-2",
  aws_cognito_identity_pool_id: "us-west-2:*************",
  aws_mandatory_sign_in: "disable",
  aws_appsync_region: "us-west-2",
  aws_appsync_graphqlEndpoint: "https://*****.appsync-api.us-west-2.amazonaws.com/graphql",
  aws_appsync_authenticationType: "AWS_IAM"
}
EOF
$ amplify codegen

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
