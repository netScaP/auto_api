import { Application } from '../declarations';
import users from './users/users.service';
import clients from './clients/clients.service';
import companies from './companies/companies.service';
import companyFeedbacks from './company-feedbacks/company-feedbacks.service';
import orders from './orders/orders.service';
import clientFeedbacks from './client-feedbacks/client-feedbacks.service';
import orderFeedbacks from './order-feedbacks/order-feedbacks.service';
import orderResponse from './order-response/order-response.service';
import sendSms from './send-sms/send-sms.service';
import auth from './auth/auth.service';
import carSearch from './car/search/search.service';
import carInfo from './car/info/info.service';
import cars from './cars/cars.service';
import statsLineChart from './stats/line-chart/line-chart.service';
import statsPieChart from './stats/pie-chart/pie-chart.service';
import uploads from './uploads/uploads.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(clients);
  app.configure(companies);
  app.configure(companyFeedbacks);
  app.configure(orders);
  app.configure(clientFeedbacks);
  app.configure(orderFeedbacks);
  app.configure(orderResponse);
  app.configure(sendSms);
  app.configure(auth);
  app.configure(carSearch);
  app.configure(carInfo);
  app.configure(cars);
  app.configure(statsLineChart);
  app.configure(statsPieChart);
  app.configure(uploads);
}
