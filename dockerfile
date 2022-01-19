FROM public.ecr.aws/lambda/nodejs:14

WORKDIR ${LAMBDA_TASK_ROOT}
COPY package.json .
RUN npm install
COPY dist .

CMD [ "index.handler" ]