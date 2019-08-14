FROM python:3

ARG UID=1005
ARG GID=1005

COPY . /app
WORKDIR /app

RUN pip install pipenv
RUN pipenv install --system --deploy

RUN addgroup --group --gid $GID appgroup
RUN adduser --system --uid $UID --gid $GID --disabled-password appuser

#RUN egrep -i ":$GID:" /etc/passwd &>/dev/null || addgroup --group --gid "$GID" appgroup
#RUN egrep -i ":$UID:" /etc/passwd &>/dev/null || adduser -S appuser -G appgroup \
#    --uid "$UID" \
#    --disabled-password

RUN chown -R $UID:$GID /app
USER $UID:$GID

CMD ["python", "web.py"]