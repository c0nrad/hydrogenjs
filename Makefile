run:
	npm start

build:
	ng build --prod --outputPath=docs --deploy-url "https://blog.c0nrad.io/hydrogenjs/" --base-href "/hydrogenjs/"

deploy: build
	cd ../..; git add -A .;	git commit -m "release"; git push origin master