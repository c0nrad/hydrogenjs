run:
	npm start

build:
	ng build --prod --deploy-url "https://blog.c0nrad.io/hydrogenjs/" --base-href "https://blog.c0nrad.io/hydrogenjs/"
	mv ./dist/hydrogenjs/* ./docs

deploy: build
	cd ../..; git add -A .;	git commit -m "release"; git push origin master
