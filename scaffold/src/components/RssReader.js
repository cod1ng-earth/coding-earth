import React, { useState, useEffect } from 'react';

import { Card, Content } from 'react-bulma-components';

function feedFilter(data, filter) {
  let news = data.news;
  if (news) {
    news = news.filter(({title, contentSnippet, publishDate}) => {
      return filter.test(title) || filter.test(contentSnippet) || filter.test(publishDate)
    })
    console.log(news, filter);
    return {...data, news};
  }
  return data;
}

export default props => {
    const [content, setContent] = useState({});

    useEffect(
      () => {
        props.componentData(props.tag, setContent, feedFilter)
    },
      [props]
    );

    return (
        <Card>
            {content.news ?
                content.news.map(item => (
                    <Card key={item.id}>
                        <Card.Header>
                            <Card.Header.Title>{item.title}</Card.Header.Title>
                        </Card.Header>
                        <Card.Content>
                            <Content>
                                {item.contentSnippet}
                            </Content>
                        </Card.Content>
                        <Card.Footer>
                            <Card.Footer.Item renderAs="a" href={item.link}>
                                visit
                            </Card.Footer.Item>
                        </Card.Footer>
                    </Card>
                ))

                :
                <p>no news yet</p>
            }
        </Card>
    );
}
