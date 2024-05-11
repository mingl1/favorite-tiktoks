    
# EDA and vectorizing data


```python
from openai import OpenAI
import pandas as pd
import numpy as np
import os
import json
from dotenv import load_dotenv

load_dotenv()
# create .env file and add OPENAI_API_KEY, it should start with sk-...
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
```


```python
client = OpenAI()
# set the api key

client.api_key = OPENAI_API_KEY

# This function takes a text and returns the embedding of the text from openai
def my_get_embedding(text, model="text-embedding-3-small"):
   text = text.replace("\n", " ")
   text = ''.join(filter(str.isalnum, text))
   return client.embeddings.create(input = [text], model=model).data[0].embedding
```


```python

# Create a dataframe from the json files
path_to_json = './videos/'
json_files = [pos_json for pos_json in os.listdir(path_to_json) if pos_json.endswith('.json')]
# the ID field will contain the date and the video ID that is unique for each video and can be combined with https://www.tiktokv.com/share/video/... to get the video URL
data=dict()
titles = []
for i in json_files:
  with open(path_to_json+i) as jf:
      j = json.load(jf)
      txt = ''
      try:
        txt = ';'.join(j['itemInfo']['itemStruct']['suggestedWords']) 
      except Exception as _:
        txt = ''
      try:
        txt += j['itemInfo']['itemStruct']['desc'] + ';' + j['shareMeta']['title']
        titles.append(j['shareMeta']['title'])
      except Exception as _:
        continue
      data[i] = txt
df = {'id':data.keys(),'text':data.values(),'title': titles}
df = pd.DataFrame.from_dict(df)
```


```python
# Example of the dataframe
print(df[['id','title']].head())

```

                                                 id  \
    0  2020-12-11T16-36-48_6904707844294053126.json   
    1  2020-12-15T17-25-26_6905454041074011398.json   
    2  2020-12-15T19-14-43_6897881517813402885.json   
    3  2020-12-15T20-01-31_6901495881992867077.json   
    4  2020-12-15T20-09-37_6898107668905331974.json   
    
                                      title  
    0                 Matt Lorion on TikTok  
    1  Wonsulting | Career Tips👀💡 on TikTok  
    2           unstoppablegiggle on TikTok  
    3    Sam - Your Career Bestie on TikTok  
    4              Mariella Mahal on TikTok  



```python
# Lets remove the " on TikTok" from the title
df['title'] = df['title'].str.replace(' on TikTok','')
print(df[['id','title']].head())

```

                                                 id                       title
    0  2020-12-11T16-36-48_6904707844294053126.json                 Matt Lorion
    1  2020-12-15T17-25-26_6905454041074011398.json  Wonsulting | Career Tips👀💡
    2  2020-12-15T19-14-43_6897881517813402885.json           unstoppablegiggle
    3  2020-12-15T20-01-31_6901495881992867077.json    Sam - Your Career Bestie
    4  2020-12-15T20-09-37_6898107668905331974.json              Mariella Mahal



```python
# This will get the embeddings of the text
embeddings = []
for txt in df['text']:
    embeddings.append(my_get_embedding(txt))
```


```python
# Save the embeddings to a file
df['embeddings'] = embeddings
df.to_csv('vids_with_embeds.csv',index=False)
```


```python
# Now you have a dataframe with the embeddings! Note that the links of the videos are in the 'id' column, seperated by the underscore
print(df.head())
print(len(df['embeddings'][0]))
```

                                                 id  \
    0  2020-12-11T16-36-48_6904707844294053126.json   
    1  2020-12-15T17-25-26_6905454041074011398.json   
    2  2020-12-15T19-14-43_6897881517813402885.json   
    3  2020-12-15T20-01-31_6901495881992867077.json   
    4  2020-12-15T20-09-37_6898107668905331974.json   
    
                                                    text  \
    0  Trading Motivation;trading places;Trading Spac...   
    1  How do you get a referral for companies like i...   
    2  Reply to @bankai_zabimaru #greenscreen #stemli...   
    3  How to respond (and crush it) when an intervie...   
    4  i haven’t paid for books in 2 years - like for...   
    
                            title  \
    0                 Matt Lorion   
    1  Wonsulting | Career Tips👀💡   
    2           unstoppablegiggle   
    3    Sam - Your Career Bestie   
    4              Mariella Mahal   
    
                                              embeddings  
    0  [0.004208823665976524, -0.03823400288820267, 0...  
    1  [-0.0031721279956400394, 0.004200569353997707,...  
    2  [0.017734628170728683, -0.024280162528157234, ...  
    3  [-0.003541965037584305, -0.03863702714443207, ...  
    4  [-0.013438946567475796, -0.01910446211695671, ...  
    1536


# Process the embeddings for upload


```python
import pandas as pd

df = pd.read_csv('vids_with_embeds.csv')
embeddings = df['embeddings']
```


```python
# Sanity Check
df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>id</th>
      <th>text</th>
      <th>title</th>
      <th>embeddings</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2020-12-11T16-36-48_6904707844294053126.json</td>
      <td>Trading Motivation;trading places;Trading Spac...</td>
      <td>Matt Lorion</td>
      <td>[0.004208823665976524, -0.03823400288820267, 0...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2020-12-15T17-25-26_6905454041074011398.json</td>
      <td>How do you get a referral for companies like i...</td>
      <td>Wonsulting | Career Tips👀💡</td>
      <td>[-0.0031721279956400394, 0.004200569353997707,...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2020-12-15T19-14-43_6897881517813402885.json</td>
      <td>Reply to @bankai_zabimaru #greenscreen #stemli...</td>
      <td>unstoppablegiggle</td>
      <td>[0.017734628170728683, -0.024280162528157234, ...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2020-12-15T20-01-31_6901495881992867077.json</td>
      <td>How to respond (and crush it) when an intervie...</td>
      <td>Sam - Your Career Bestie</td>
      <td>[-0.003541965037584305, -0.03863702714443207, ...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2020-12-15T20-09-37_6898107668905331974.json</td>
      <td>i haven’t paid for books in 2 years - like for...</td>
      <td>Mariella Mahal</td>
      <td>[-0.013438946567475796, -0.01910446211695671, ...</td>
    </tr>
  </tbody>
</table>
</div>




```python
new_embeddings = []
# convert the string representation of the lists to a list of floats
print(type(df['embeddings'].iloc[0]))
for e in embeddings:
    new_embeddings.append([float(x) for x in e[1:-1].split(',')])
df['embeddings'] = new_embeddings
print(type(df['embeddings'].iloc[0]))
# print(df.head())
# replace NaN titles with Anonymus

```

    <class 'str'>
    <class 'list'>



```python
# Convert the string representation of the list to a list of floats
# print(type(df['embeddings'].iloc[0]))
# df["embeddings"] = df.embeddings.apply(eval).apply(np.array)
# print(type(df['embeddings'].iloc[0]))
df['title'] = df['title'].fillna('Anonymus')
```


```python
def normalize(x):
   return np.sqrt(np.sum(np.square(x)))

def search(df, B, n=3, pprint=True):

   embedding = my_get_embedding(B)
   df['similarities'] = df.embeddings.apply(lambda A: np.dot(A,embedding)/(normalize(A)*normalize(embedding)))
   res = df.sort_values('similarities', ascending=False).head(n)
   return res

```


```python
res = search(df, 'books', n=3)
```


```python

print("Dimention of the embeddings: ",len(res['embeddings'].iloc[0]))
res.head()
```

    Dimention of the embeddings:  1536





<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>id</th>
      <th>text</th>
      <th>title</th>
      <th>embeddings</th>
      <th>similarities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>4</th>
      <td>2020-12-15T20-09-37_6898107668905331974.json</td>
      <td>i haven’t paid for books in 2 years - like for...</td>
      <td>Mariella Mahal</td>
      <td>[-0.013438946567475796, -0.01910446211695671, ...</td>
      <td>0.293667</td>
    </tr>
    <tr>
      <th>146</th>
      <td>2023-03-17T21-02-09_7211241979890404650.json</td>
      <td>kuru toga;kuru toga mechanical pencil;best mec...</td>
      <td>bungu.store</td>
      <td>[0.024209968745708466, 0.009360017254948616, -...</td>
      <td>0.236675</td>
    </tr>
    <tr>
      <th>11</th>
      <td>2020-12-28T20-41-32_6908485370212551941.json</td>
      <td>Since people been asking for Manhwa recommenda...</td>
      <td>breezylouie</td>
      <td>[0.044516436755657196, 0.019246326759457588, -...</td>
      <td>0.207206</td>
    </tr>
  </tbody>
</table>
</div>



## The search is working! All the results are related to the search word "book". Take note of the dimention of the embeddings
<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>id</th>
      <th>text</th>
      <th>title</th>
      <th>embeddings</th>
      <th>similarities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>4</th>
      <td>2020-12-15T20-09-37_6898107668905331974.json</td>
      <td>i haven’t paid for books in 2 years - like for...</td>
      <td>Mariella Mahal</td>
      <td>[-0.013438946567475796, -0.01910446211695671, ...</td>
      <td>0.293667</td>
    </tr>
    <tr>
      <th>146</th>
      <td>2023-03-17T21-02-09_7211241979890404650.json</td>
      <td>kuru toga;kuru toga mechanical pencil;best mec...</td>
      <td>bungu.store</td>
      <td>[0.024209968745708466, 0.009360017254948616, -...</td>
      <td>0.236675</td>
    </tr>
    <tr>
      <th>11</th>
      <td>2020-12-28T20-41-32_6908485370212551941.json</td>
      <td>Since people been asking for Manhwa recommenda...</td>
      <td>breezylouie</td>
      <td>[0.044516436755657196, 0.019246326759457588, -...</td>
      <td>0.207206</td>
    </tr>
  </tbody>
</table>
</div>

# Upload embeddings into pinecone
## Create an account on pinecone.io and create a free index, ensure the metric of the index is cosine and the dimensions is the same as the one noted above (1536 if using "text-embedding-3-small")


```python
from pinecone import Pinecone
from dotenv import load_dotenv

load_dotenv()
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')

```

    f:\savedtt\tiktok-save\.venv\lib\site-packages\pinecone\data\index.py:1: TqdmWarning: IProgress not found. Please update jupyter and ipywidgets. See https://ipywidgets.readthedocs.io/en/stable/user_install.html
      from tqdm.autonotebook import tqdm



```python
pc = Pinecone(api_key=PINECONE_API_KEY)
# Make this the name of the index you created on the Pinecone dashboard
name_of_index = "tt"
# name_of_index = "quickstart"
index = pc.Index(name_of_index)
```


```python
# upserting a list of tuples of the form (id, embedding)
vals = []
for i in range(len(df)):
    vals.append(({"id":df['id'][i], "values":df['embeddings'][i],"metadata":{'title':df['title'][i],'text':df['text'][i]}}))
```


```python
from tqdm.auto import tqdm

for batch in tqdm(range(0, len(vals), 50)):
    print(f"Upserting batch {batch} to {batch+50}")
    index.upsert(vals[batch:batch+50],namespace='tt')
```

      0%|          | 0/4 [00:00<?, ?it/s]

    Upserting batch 0 to 50


     25%|██▌       | 1/4 [00:00<00:02,  1.42it/s]

    Upserting batch 50 to 100


     50%|█████     | 2/4 [00:01<00:01,  1.47it/s]

    Upserting batch 100 to 150


     75%|███████▌  | 3/4 [00:01<00:00,  1.57it/s]

    Upserting batch 150 to 200


    100%|██████████| 4/4 [00:02<00:00,  1.74it/s]



```python
# If you forgot to add a metadata field, you can update it using the following code
# I forgot to add the text field to the metadata

from tqdm.auto import tqdm

for batch in tqdm(range(0, len(vals))):
    index.update(id=vals[i]['id'],namespace='tt',set_metadata={'text':vals[i]['metadata']['text']})
```


```python
# test with a query
book_embed = my_get_embedding("books")
```


```python
res = index.query(
  vector=book_embed,
  top_k=3,
  include_metadata=True,
  namespace='tt'
  
)
test = [x['id'] for x in res['matches']]
```


```python
res
```




    {'matches': [{'id': '2020-12-15T20-09-37_6898107668905331974.json',
                  'metadata': {'title': 'Mariella Mahal'},
                  'score': 0.293735325,
                  'values': []},
                 {'id': '2023-03-17T21-02-09_7211241979890404650.json',
                  'metadata': {'title': 'bungu.store'},
                  'score': 0.236255735,
                  'values': []},
                 {'id': '2020-12-28T20-41-32_6908485370212551941.json',
                  'metadata': {'title': 'breezylouie'},
                  'score': 0.208099678,
                  'values': []}],
     'namespace': 'tt',
     'usage': {'read_units': 6}}




```python
# Get the videos that are associated with the ids
df[df['id'].isin(test)][['title','id','text']]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>title</th>
      <th>id</th>
      <th>text</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>4</th>
      <td>Mariella Mahal</td>
      <td>2020-12-15T20-09-37_6898107668905331974.json</td>
      <td>i haven’t paid for books in 2 years - like for...</td>
    </tr>
    <tr>
      <th>11</th>
      <td>breezylouie</td>
      <td>2020-12-28T20-41-32_6908485370212551941.json</td>
      <td>Since people been asking for Manhwa recommenda...</td>
    </tr>
    <tr>
      <th>146</th>
      <td>bungu.store</td>
      <td>2023-03-17T21-02-09_7211241979890404650.json</td>
      <td>kuru toga;kuru toga mechanical pencil;best mec...</td>
    </tr>
  </tbody>
</table>
</div>



# Sucess! The queries returned from the pinecone index are the ones related to the search term.
## You can setup a basic flask server on AWS or cloud service provider of your choice to create your own TikTok Favorites API for website/app.
<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>title</th>
      <th>id</th>
      <th>text</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>4</th>
      <td>Mariella Mahal</td>
      <td>2020-12-15T20-09-37_6898107668905331974.json</td>
      <td>i haven’t paid for books in 2 years - like for...</td>
    </tr>
    <tr>
      <th>11</th>
      <td>breezylouie</td>
      <td>2020-12-28T20-41-32_6908485370212551941.json</td>
      <td>Since people been asking for Manhwa recommenda...</td>
    </tr>
    <tr>
      <th>146</th>
      <td>bungu.store</td>
      <td>2023-03-17T21-02-09_7211241979890404650.json</td>
      <td>kuru toga;kuru toga mechanical pencil;best mec...</td>
    </tr>
  </tbody>
</table>
</div>

# Example of Basic Flask App
```python


from flask import Flask,request
from openai import OpenAI
import os
import requests
import json
app = Flask(__name__)


OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
name_of_index = os.getenv("INDEX_NAME")


def my_get_embedding(text, client,model="text-embedding-3-small",):
   text = text.replace("\n", " ")
   text = ''.join(filter(str.isalnum, text))
   return client.embeddings.create(input = [text], model=model).data[0].embedding

@app.route("/search", methods=["GET"])
def get_tiktoks():
    client = OpenAI()
    client.api_key = OPENAI_API_KEY
    url = f"https://{name_of_index}/query"
    headers = {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json"
    }

    args = request.args

    search = args.get("search", default="", type=str)
    n = args.get("n", default=3, type=int)

    search_embed = my_get_embedding(search, client)
    data = {
        "vector": search_embed,
        "topK": n,
        "includeValues": False,
        "includeMetadata": True,
        "namespace": "tt" # Ensure this is the name space of the upserted records
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        response= response.json()
        response = response['matches']
    return json.dumps(response)

```

