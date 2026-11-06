import { FedaPay, Transaction } from 'fedapay';

// On initialise FedaPay avec la cle secrete
FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY!);

// On precise qu'on est en mode test (sandbox)
FedaPay.setEnvironment('sandbox');

export { FedaPay, Transaction };