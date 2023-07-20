import React from "react"
import PropTypes from "prop-types"
import Im from "immutable"

export default class Operations extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    oas3Selectors: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
    fn: PropTypes.func.isRequired
  }

  render() {
    let {
      specSelectors,
    } = this.props

    const taggedOps = specSelectors.taggedOperations()

    // //RW hack
    // //The core issue is why the default tag gets introduced in the first place; clearly specs mixing.
    // if(taggedOps.get('default')?.size > 0){
    //   taggedOps = taggedOps.delete('default');
    // }
      // console.log("=====================================================================")
      // console.log("Specselectors")
      // console.log(specSelectors);
      // console.log("Computing: specSelectors.operations().toArray().map(x => x.toArray())");
      // console.log("with a total of: " + specSelectors.operations().toArray().length);
      // console.log(specSelectors.operations().toArray().map(x => x.toArray()));

      // console.log("Computing: Object.fromEntries(specSelectors.paths())");
      // console.log(Object.fromEntries(specSelectors.paths()));

       console.log("Computing: taggedOps");
      // console.log("with a total of: " + taggedOps.size);
       console.log(Object.fromEntries(taggedOps));
      // console.log(taggedOps);

      // console.log("Computing: specSelectors.specJS().paths");
      // console.log("with a total of: " + Object.entries(specSelectors.specJS().paths).length);
      // console.log(specSelectors.specJS().paths);

    //================================================================
    // var tags = [];

    // for(var [path, pathVerbAndDetail] in Object.entries(specSelectors.specJS().paths)){
    //   tags.push(...specSelectors.specJS().paths[path][pathVerbAndDetail].tags);
    // }

    // var hackedMockForTags =  new Map();

    // for(var tag in tags){

    //   var operation = new Map()
    //   operation.set('tagDetails', undefined);
    //   operation.set('operations', specSelectors.specJS().paths);

    //   if(hackedMockForTags.get(tag)){
    //     var existingValue = hackedMockForTags.get(tag);
    //     existingValue.push(operation);
    //   }
    //   else{
    //     hackedMockForTags.set(tag, [operation])
    //   }
    // }

    //hackedMockForTags = ""

    if(taggedOps.size === 0) {
      return <h3> No operations defined in spec!</h3>
    }

    return (
      <div>
        { taggedOps.map(this.renderOperationTag).toArray() }
        { taggedOps.size < 1 ? <h3> No operations defined in spec! </h3> : null }
      </div>
    )
  }

  renderOperationTag = (tagObj, tag) => {
    const {
      specSelectors,
      getComponent,
      oas3Selectors,
      layoutSelectors,
      layoutActions,
      getConfigs,
    } = this.props
    const validOperationMethods = specSelectors.validOperationMethods()
    const OperationContainer = getComponent("OperationContainer", true)
    const OperationTag = getComponent("OperationTag")
    const operations = tagObj.get("operations")
    return (
      <OperationTag
        key={"operation-" + tag}
        tagObj={tagObj}
        tag={tag}
        oas3Selectors={oas3Selectors}
        layoutSelectors={layoutSelectors}
        layoutActions={layoutActions}
        getConfigs={getConfigs}
        getComponent={getComponent}
        specUrl={specSelectors.url()}>
        <div className="operation-tag-content">
          {/* {[
            console.log('2'),
            console.log(tag),
            console.log(Array.from(operations).map(x => Array.from(x)))
          ]} */}
          {
            operations.map(op => {
              const path = op.get("path")
              const method = op.get("method")
              const specPath = Im.List(["paths", path, method])

              if (validOperationMethods.indexOf(method) === -1) {
                return null
              }

              return (
                <OperationContainer
                  key={`${path}-${method}`}
                  specPath={specPath}
                  op={op}
                  path={path}
                  method={method}
                  tag={tag} />
              )
            }).toArray()
          }
        </div>
      </OperationTag>
    )
  }

}

Operations.propTypes = {
  layoutActions: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired
}
