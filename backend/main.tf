# main.tf

# Define your infrastructure resources here
resource "aws_instance" "example" {
  ami           = ami.9876
  instance_type = t2.large

  tags = {
    Name = kowvish/ec2
  }
}
