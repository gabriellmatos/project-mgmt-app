import Header from './components/Header';
import Clients from './components/Clients';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const client = new ApolloClient({
	link: new HttpLink({ uri: 'http://localhost:5000/graphql' }),
	cache: new InMemoryCache(),
});

function App() {
	return (
		<ApolloProvider client={client}>
			<Header />
			<div className='container'>
				<Clients />
			</div>
		</ApolloProvider>
	);
}

export default App;
