import React, { Component } from 'react';
import { View } from 'react-native';
import { times } from 'lodash';
import PropTypes from 'prop-types';
import StepIcon from './StepIcon';

class ProgressSteps extends Component {
  state = {
    stepCount: 0,
    activeStep: this.props.activeStep
  };

  componentDidMount() {
    this.setState({ stepCount: React.Children.count(this.props.children) });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.activeStep !== this.props.activeStep){
      this.setActiveStep(this.props.activeStep);
    }
  }

  getChildProps() {
    return { ...this.props, ...this.state };
  }

  renderStepIcons = () => {
    let step = [];

    times(this.state.stepCount, i => {
      const isCompletedStep = this.props.hasFailures
        ? false
        : this.props.isComplete
          ? true 
          : i < this.state.activeStep;
        
      const isActiveStep = this.props.isComplete || this.props.hasFailures
        ? false 
        : i === this.state.activeStep;

      step.push(
        <View key={i}>
          <View>
            <StepIcon
              {...this.getChildProps()}
              stepNum={i + 1}
              label={this.props.children[i].props.label}
              isFirstStep={i === 0}
              isLastStep={i === this.state.stepCount - 1}
              isCompletedStep={isCompletedStep}
              isActiveStep={isActiveStep}
              isFailedStep={this.props.hasFailures}
            />
          </View>
        </View>
      );
    });

    return step;
  };

  // Callback function from ProgressStep that passes current step.
  setActiveStep = step => {
    if (step > -1) {
      this.setState({ activeStep: step });
    }
  };

  render() {
    const styles = {
      stepIcons: {
        position: 'relative',
        justifyContent: 'space-evenly',
        alignSelf: 'center',
        flexDirection: 'row',
        top: 30,
        marginBottom: 50
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.stepIcons}>{this.renderStepIcons()}</View>
        <View style={{ flex: 1 }}>
          {React.cloneElement(this.props.children[this.state.activeStep], {
            setActiveStep: this.setActiveStep,
            activeStep: this.state.activeStep,
            stepCount: this.state.stepCount
          })}
        </View>
      </View>
    );
  }
}

ProgressSteps.propTypes = {
  isComplete: PropTypes.bool,
  activeStep: PropTypes.number,
  hasFailures: PropTypes.bool
};

ProgressSteps.defaultProps = {
  isComplete: false,
  activeStep: 0,
  hasFailures: false
};

export default ProgressSteps;
