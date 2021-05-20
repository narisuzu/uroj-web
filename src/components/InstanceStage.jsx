import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import InitDialog from './instance/dialog';
import { initInstance } from './instance/instance';
import { SnackbarProvider, useSnackbar } from 'notistack';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NetworkStatus,
  split,
  useMutation,
  useQuery,
  useSubscription
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { CANCEL_ROUTE, INIT_INS, NEW_ROUTE, RUN, UPDATE } from '../mixins/game/schema';

const Stage = () => <div id='stage'
                         style={{ backgroundColor: 'black', width: '100%', height: '100%', userSelect: 'none' }} />;

function InstanceStage({ iid }) {
  const { enqueueSnackbar } = useSnackbar();
  const [ins, setIns] = useState(null);

  console.log('reload');
  const [run, { loading: runLoading, called: newed }] = useMutation(RUN);
  const [createRoute] = useMutation(NEW_ROUTE, {
    ignoreResults: true
  });
  const [cancelRoute] = useMutation(CANCEL_ROUTE, {
    ignoreResults: true
  });

  const { loading: layoutLoading, error, data, refetch, networkStatus, subscribeToMore } = useQuery(INIT_INS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: iid
    }
  });

  const obj = localStorage.getItem(iid);
  let needInit = true;
  if (obj) {
    needInit = JSON.parse(obj).state === 'PRESTART';
  }

  if (needInit && !newed) {
    run({
      variables: { id: iid }
    }).then(res => {
      localStorage.setItem(iid, JSON.stringify({ state: res.data.run }));
      refetch();
    }).catch(e => {
      console.error(e);
    });
  }

  if (runLoading || layoutLoading || networkStatus === NetworkStatus.refetch) {
    return <InitDialog step={'loading'} />;
  }

  if (error) {
    return <InitDialog onRetry={() => refetch()} text={error.message} step={'error'} />;
  }

  const update_global = (ins, globalStatus) => {
    globalStatus.nodes.forEach(n => {
      ins.updateNode(n.id, n.state);
    });
    globalStatus.signals.forEach(s => {
      ins.updateSignal(s.id, s.state);
    });
  };

  if (!ins) {
    const { stationLayout, globalStatus } = data;
    const ins = initInstance({
      title: stationLayout.title,
      signals: stationLayout.signals,
      nodes: stationLayout.nodes,
      kind: 'excersize',
      onCreateRoute: (btn1, btn2) => {
        createRoute({
          variables: {
            id: iid,
            input: {
              startBtn: btn1.kind,
              startSgn: btn1.signalId,
              endBtn: btn2.kind,
              endSgn: btn2.signalId
            }
          }
        }).then(res => {
          console.info(res);
        }).catch(e => {
          enqueueSnackbar('新建进路：' + e, { variant: 'warning' });
        });
      },
      onCancelRoute: (btn) => {
        cancelRoute({
          variables: {
            id: iid,
            input: {
              startBtn: btn.kind,
              startSgn: btn.signalId,
            }
          }
        }).then(res => {
          console.info(res);
        }).catch(e => {
          enqueueSnackbar('取消进路：' + e, { variant: 'warning' });
        });
      }
    });
    update_global(ins, globalStatus);
    setIns(ins);
  }

  subscribeToMore({
    document: UPDATE,
    variables: {id: iid},
    updateQuery: (_ , {subscriptionData}) => {
      if (!subscriptionData.data || !ins) return;
      const gameUpdate = subscriptionData.data.gameUpdate;
      console.log(gameUpdate);
      switch (gameUpdate.__typename) {
        case 'GlobalStatus': {
          update_global(ins, gameUpdate);
          break;
        }
        case 'UpdateNode': {
          ins.updateNode(gameUpdate.id, gameUpdate.state);
          break;
        }
        case 'UpdateSignal': {
          ins.updateSignal(gameUpdate.id, gameUpdate.state);
          break;
        }
      }
    }
  })

  return null;
}

export default function InstanceLayout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  useEffect(() => {
    if (state === null) {
      navigate('/404', { replace: true });
    }
  }, [navigate, state]);

  if (state === null) {
    return null;
  }
  console.log('called');

  const { uri } = state; // Read values passed on state

  const httpLink = new HttpLink({
    uri: 'http://' + uri
  });

  const wsLink = new WebSocketLink({
    uri: 'ws://' + uri,
    options: {
      reconnect: true
    }
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <SnackbarProvider maxSnack={3}>
        <Stage />
        <InstanceStage iid={id} />
      </SnackbarProvider>
    </ApolloProvider>
  );

}
