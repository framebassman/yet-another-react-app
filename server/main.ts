import * as path from 'path';
import * as express from 'express';

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/customer_agreement', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(path.join(__dirname, '../public/files/agreement.pdf'));
});

/*
app.get('/privacy_policy', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(path.join(__dirname, '../public/files/policy.pdf'));
});
*/

app.get('/', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(7000, () => {
    // tslint:disable-next-line:no-console
    console.log('Web app listening on port 7000');
});
