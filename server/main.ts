import * as path from 'path';
import * as express from 'express';
import {Request, Response} from 'express';

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200);
});

app.get('/customer_agreement', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(path.join(__dirname, '../public/files/agreement.pdf'));
});

/*
app.get('/privacy_policy', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(path.join(__dirname, '../public/files/policy.pdf'));
});
*/

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(7000, () => {
    // tslint:disable-next-line:no-console
    console.log('Web app listening on port 7000');
});
