FROM python:3.12.2

RUN mkdir /app
WORKDIR /app

# Install MySQL dependencies
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev gcc \
    && rm -rf /var/lib/apt/lists/*


COPY /requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/

#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]