from flask import Flask
from flask_restful import Resource, Api
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve
import pandas as pd
import numpy as np

app = Flask(__name__)
api = Api(app)


class ROC(Resource):
    def get(self, preprocessing, c):
        # you need to preprocess the data according to user preferences (only fit preprocessing on train data)
        if preprocessing == "standardization":
            scaler = StandardScaler()
        elif preprocessing == "min-max-scaling":
            scaler = MinMaxScaler()
        else:
            return {'warning': 'Please preprocess the data using either \'standardization\' or \'min-max-scaling\''}
        
        if (not c.replace('.', '', 1).isdigit()):
            return {'warning': 'C must be a positive float'}

        scaler.fit(X_train)
        X_train_scaled = scaler.transform(X_train)
        X_test_scaled = scaler.transform(X_test)

        # fit the model on the training set
        clf = LogisticRegression(C = float(c)).fit(X_train_scaled, y_train)

        # predict probabilities on test set
        scores = clf.predict_proba(X_test_scaled)[:,1]
        
        # return the false positives, true positives, and thresholds using roc_curve()
        fpr, tpr, thresholds = roc_curve(y_test, scores, pos_label=1)
        res = []
        for i in range(len(fpr)):
            res_item = {}
            res_item['tpr'] = tpr[i]
            res_item['fpr'] = fpr[i]
            res_item['threshold'] = thresholds[i]
            res.append(res_item)
        return res


# Here you need to add the ROC resource, ex: api.add_resource(HelloWorld, '/')
# for examples see 
# https://flask-restful.readthedocs.io/en/latest/quickstart.html#a-minimal-api
api.add_resource(ROC, '/<string:preprocessing>/<string:c>')


if __name__ == '__main__':
    # load data
    df = pd.read_csv('data/transfusion.data')
    xDf = df.loc[:, df.columns != 'Donated']
    y = df['Donated']
    # get random numbers to split into train and test
    np.random.seed(1)
    r = np.random.rand(len(df))
    # split into train test
    X_train = xDf[r < 0.8]
    X_test = xDf[r >= 0.8]
    y_train = y[r < 0.8]
    y_test = y[r >= 0.8]
    app.run(debug=True)
