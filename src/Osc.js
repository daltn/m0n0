import p5 from 'processing';

export default function sketch(p) {
  let rotation = 0;

  p.setup = function() {
    p.createCanvas(1024, 500);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    if (props.samples) {
      rotation = (props.rotation * Math.PI) / 180;
    }
  };

  let analyzer = new p5.FFT(0, 1024);
  analyzer.setInput();

  p.draw = function() {
    p.background(30, 30, 30, 220);
    p.noStroke();
    p.push();
    p.rotateY(rotation);
    p.box(100);
    p.pop();
  };
}
