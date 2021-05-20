import { gql } from '@apollo/client';

export const LIST_ALL_INSTANCES = gql`
  query {
    instances{
      id,
      title,
      player,
      station{title},
      currState,
      beginAt,
      executor{addr}
    }
  }
`;

export const LIST_ALL_USERS = gql`
  query {
    users{
      id,
      email,
      role,
      class{name},
      dateJoined,
      lastLogin,
      isActive,
    }
  }
`;


export const QUERY_ME = gql`
  query MeQuery {
    me{
      id,
      role
    }
  }
`;


export const QUERY_ME_DETAIL = gql`
  query MeQuery {
    me{
      id,
      email,
      class{name},
      role,
      isActive,
      dateJoined
    }
  }
`;

export const GET_NEW_INS_INFO = gql`
  query {
    executors{
      id,
      addr
    },
    users{
      id
    },
    me{id}
  }
`;

export const GET_EXECUTORS = gql`
  query {
    executors{
      id,
      addr
    }
  }
`;


export const SIGN_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input)
  }
`;

export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
      email
    }
  }
`;


export const ADD_INSTANCE = gql`
  mutation CreateInstance($input: InstanceInput!){
    createInstance(input: $input){
      id,
      title,
      player,
      beginAt,
      executor{addr}
    }
  }
`;

export const LIST_ALL_STATION = gql`
  query {
    stations{
      id,
      title,
      description,
      created,
      authorId
    }
  }
`

export const GET_STATION = gql`
  query GetStation($id: Int!){
    station(id: $id){
      title,
      description,
      created,
      updated,
      draft,
      authorId,
      yaml
    }
  }
`;

export const INIT_INS = gql`
  query InitIns($id: String){
    stationLayout(id: $id){
      title,
      nodes{nodeId, trackId, leftP{x,y}, rightP{x,y}, leftJoint, rightJoint},
      signals{signalId,sgnType,sgnMnt,protectNodeId,side,dir,pos{x,y},btns}
    }
    globalStatus(id: $id){
      nodes{id, state},
      signals{id, state}
    }
  }
`;

export const RUN = gql`
  mutation Run($id: String!){
    run(id: $id)
  }
`;

export const CANCEL_ROUTE = gql`
  mutation CancelRoute($id: String!, $input: CancelRouteInput!) {
    cancelRoute(id: $id, input: $input)
  }
`

export const UPDATE = gql`
  subscription Update($id: String!){
    gameUpdate(id: $id){
      __typename
      ... on UpdateNode{
        id,
        state
      }
      ... on UpdateSignal{
        id,
        state
      }
      ... on UpdateQuestion{
        id,
        state
      }
      ... on GlobalStatus{
        nodes{id, state},
        signals{id, state}
      }
      ... on MoveTrain{
        id,
        nodeId,
        process,
        dir
      }
    }
  }
`;

export const NEW_ROUTE = gql`
  mutation NewRoute($id: String!, $input:CreateRouteInput!){
    createRoute(id: $id, input: $input)
  }
`;
