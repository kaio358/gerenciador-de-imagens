# Gerenciador de imagens
## Objetivo do Projeto
O objetivo central é desenvolver uma solução que facilite a organização de grandes volumes de imagens, utilizando técnicas de IA para classificação e reconhecimento de conteúdo visual. Além de categorizar imagens por temas gerais (como pets ou paisagens), o aplicativo será capaz de identificar pessoas específicas em fotos, agrupando-as em pastas personalizadas. Para isso, utilizaremos imagens de referência fornecidas pelo usuário, que servirão como base para o reconhecimento facial.

## Ferramentas e Tecnologias Utilizadas
Para alcançar esse objetivo, estamos utilizando as seguintes ferramentas e tecnologias:

### TensorFlow.js:

TensorFlow.js é uma biblioteca de machine learning em JavaScript que permite treinar e executar modelos de IA diretamente no navegador ou em ambientes Node.js. Escolhemos essa ferramenta por sua flexibilidade e capacidade de rodar modelos pré-treinados, como o MobileNet e o FaceAPI.

### MobileNet:

MobileNet é um modelo de rede neural pré-treinado para classificação de imagens. Ele será utilizado para categorizar as imagens com base em seus conteúdos, como animais, objetos, paisagens, etc.

### FaceAPI:

O FaceAPI é uma ferramenta essencial para o reconhecimento facial no projeto. Ele permite identificar rostos em imagens e compará-los com uma base de dados de referência. No nosso caso, as imagens de referência serão fornecidas pelo próprio usuário, que poderá enviar fotos de seus familiares, amigos ou conhecidos. O FaceAPI analisará essas imagens de referência e as utilizará como base para identificar as mesmas pessoas em outras fotos, agrupando-as automaticamente em pastas específicas.

Inicialmente, estamos utilizando o BlazeFace como uma solução temporária para detecção facial, mas a transição para o FaceAPI é prioritária, pois ele oferece funcionalidades mais avançadas, como reconhecimento facial preciso e análise de expressões.

### Electron.js:

Como o objetivo é criar um aplicativo desktop, estamos utilizando o Electron.js, um framework que permite desenvolver aplicativos multiplataforma usando tecnologias web como HTML, CSS e JavaScript. O Electron.js é ideal para este projeto, pois facilita a integração do front-end com o back-end e permite que o aplicativo seja executado em diferentes sistemas operacionais.

### Front-end (HTML e CSS):

A interface do usuário será desenvolvida utilizando HTML e CSS, garantindo uma experiência visualmente agradável e intuitiva. O front-end será responsável por exibir as imagens organizadas e permitir que o usuário interaja com o aplicativo de forma simples e eficiente.

## Incializando 
Para inicializar damos preferencia a começar pelo servidor (back end) e logo em seguida o front end, pois com isso evita problemas "futuros".
1. Abra dois terminais para que inicialize tanto o servidor quanto o front end.
2. Em um dos terminais entre no diretorio servidor. Enquanto outro manterá na raiz.
   ``` cd src/servidor ```
3. Execute o arquivo index_servidor.js
``` node index_servidor```
4. No outro terminal execute o electron.
``` npx electron . ```
## Lista de afazeres 

[ ] Identificar o rosto com mais precisão
[ ] Concertar identificação de rosto de pessoa por algo que não tem
[ ] Traduzir textos 

